use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Measurement {
    Cup,
    ML
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Alert {
    Notify,
    Alarm,
    Both,
    None
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SettingsConfig {
    pub goal: u32,
    pub interval: u32,
    pub enabled: bool,
    pub sound: String,
    pub end_time: String,
    pub alert_type: Alert,
    pub start_time: String,
    pub measurement: Measurement
}
