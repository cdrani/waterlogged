use tauri::State;
use std::path::Path;
use crate::app::worker::{WorkerEvent, AsyncWorker};
use crate::config::{settings::SettingsConfig, ConfigUpdateAction};

#[tauri::command]
pub async fn update_settings(worker: State<'_, AsyncWorker>, settings: SettingsConfig) -> Result<(), String> {
    worker.send_event(WorkerEvent::UpdateSettings(settings)).await;
    Ok(())
}

#[tauri::command]
pub async fn update_config(worker: State<'_, AsyncWorker>, action: ConfigUpdateAction) -> Result<(), String> {
    worker.send_event(WorkerEvent::UpdateConfig(action.clone())).await;

    // Check the key and restart the scheduler if needed
    match action.key.as_str() {
        "interval" | "start_time" | "end_time" | "enabled" => {
            worker.send_event(WorkerEvent::StartNotifier).await;
        },
        _ => {}
    }

    Ok(())
}

#[tauri::command]
pub async fn download_backup(file_path: &str, content: &str) -> Result<(), String> {
    println!("FP: {:?} | C: {:?}", file_path, content);
    let path = Path::new(&file_path);

    std::fs::write(path, content).map_err(|e| format!("Failed to write file: {}", e))
}
