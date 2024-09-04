use std::sync::Arc;
use serde::{Serialize, Deserialize};
use tokio::time::{self, Duration, Instant};
use chrono::{Timelike, Local, NaiveTime, NaiveDateTime, TimeZone};
use tauri::{Emitter, AppHandle, async_runtime::{JoinHandle, Mutex, spawn, channel, Receiver, Sender}};

use crate::config::{Config, settings::{Alert, SettingsConfig}, ConfigUpdateAction};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum WorkerEvent {
    StartNotifier,
    ToggleAutoLaunch,
    UpdateSettings(SettingsConfig),
    UpdateConfig(ConfigUpdateAction)
}

#[derive(Debug, Clone)]
pub struct AsyncWorker {
    sender: Sender<WorkerEvent>
}

impl AsyncWorker {
    pub fn new(sender: Sender<WorkerEvent>) -> Self {
        Self { sender }
    }

    pub async fn send_event(&self, event: WorkerEvent) {
        let sender = self.sender.clone();

        tauri::async_runtime::spawn(async move {
             if let Err(err) = sender.send(event).await {
                println!("Error sending event: {:?}", err);
             }
        });
    }
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    sound: String,
    alert_type: String,
}

pub struct TimeValues {
    end_hour: u32,
    start_hour: u32,
    end_minute: u32,
    start_minute: u32,
}

#[derive(Debug, Clone)]
pub struct Worker {
    pub app_handle: AppHandle,
    pub receiver: Arc<Mutex<Receiver<WorkerEvent>>>,
    pub notifier: Arc<Mutex<Option<JoinHandle<()>>>>,
}

impl Worker {
    pub fn new(app_handle: AppHandle) -> (Self, AsyncWorker) {
        let (sender, receiver) = channel::<WorkerEvent>(32);
        let worker = Self { app_handle, receiver: Arc::new(Mutex::new(receiver)), notifier: Arc::new(Mutex::new(None)) };
        let async_worker = AsyncWorker::new(sender);

        (worker, async_worker)
    }

    fn parse_time_values(start_time: &str, end_time: &str) -> TimeValues {
        let start_time_parts: Vec<u32> = start_time.split(':').map(|x| x.parse().unwrap()).collect();
        let end_time_parts: Vec<u32> = end_time.split(':').map(|x| x.parse().unwrap()).collect();

        let start_hour = start_time_parts[0];
        let start_minute = start_time_parts[1];
        let end_hour = end_time_parts[0];
        let end_minute = end_time_parts[1];

        TimeValues { end_hour, start_hour, end_minute, start_minute }
    }

    pub async fn stop_notifier(&mut self) {
        if let Some(notifier) = self.notifier.lock().await.take() {
            notifier.abort(); // cancel current task
        }
    }

    pub async fn start_notifier(&mut self) {
        self.stop_notifier().await;

        let SettingsConfig { enabled, start_time, end_time, interval, .. } = Config::get_config().settings;

        if !enabled {
            return
        }

        let TimeValues { end_hour, start_hour, end_minute, start_minute } = Self::parse_time_values(&start_time, &end_time);

        let shared_self = self.clone();
        let notifier = spawn(async move {
            // let mut next_notification_time = Instant::now();
            let mut next_notification_time = Instant::now() + Duration::from_secs((interval as u64) * 60);

            time::sleep_until(next_notification_time).await;

            loop {
                let now = chrono::Local::now();
                let now_minutes = now.hour() * 60 + now.minute();
                let start_minutes = start_hour * 60 + start_minute;
                let end_minutes = end_hour * 60 + end_minute;

                if now_minutes >= start_minutes && now_minutes <= end_minutes {
                    let SettingsConfig { sound, alert_type, .. } = Config::get_config().settings;

                    match Alert::from(alert_type.to_string()) {
                        Alert::Both | Alert::Alarm => {
                            shared_self.app_handle.emit("send_alert", Payload { sound: sound.to_string(), alert_type: Alert::from(alert_type).to_string() }).unwrap();
                        },
                        _ => {}
                    }

                    next_notification_time = Instant::now() + Duration::from_secs((interval as u64) * 60);
                } else {
                    // Sleep until the start time the next day
                    
                    let today = Local::now().date_naive();
                    let start_time = NaiveTime::from_hms_opt(start_hour, start_minute, 0).unwrap();
                    let naive_datetime = NaiveDateTime::new(today, start_time);

                    let next_start_time = Local
                        .from_local_datetime(&naive_datetime)
                        .unwrap()
                        .timestamp() as u64;

                    let now_timestamp = now.timestamp() as u64;

                    let time_until_start = if next_start_time > now_timestamp {
                        next_start_time - now_timestamp
                    } else {
                        // If the start time is in the past, schedule for the next day
                        let tomorrow = today.succ_opt().unwrap();
                        let naive_datetime_tomorrow = NaiveDateTime::new(tomorrow, start_time);
                        let next_start_time_tomorrow = Local
                            .from_local_datetime(&naive_datetime_tomorrow)
                            .unwrap()
                            .timestamp() as u64;

                        next_start_time_tomorrow - now_timestamp
                    };

                    time::sleep(Duration::from_secs(time_until_start)).await;
                }

                time::sleep_until(next_notification_time).await;
            }
        });

        *self.notifier.lock().await = Some(notifier);
    }

    pub fn listen(&mut self) {
        let shared_worker = self.clone();

        spawn(async move {
            loop {
                if let Some(message) = shared_worker.receiver.lock().await.recv().await {
                    match message {
                        WorkerEvent::ToggleAutoLaunch => {
                            let auto_launch = Config::get_config().app.auto_launch;
                            Config::set_auto_launch(!auto_launch)
                        }
                        WorkerEvent::StartNotifier => {
                            let mut worker = shared_worker.clone();
                            worker.start_notifier().await;
                        }
                        WorkerEvent::UpdateSettings(settings) => {
                            Config::update_settings(settings)
                        }
                        WorkerEvent::UpdateConfig(action) => {
                            Config::update_config(action)
                        }
                    }
                }
            }
        });
    }
}
