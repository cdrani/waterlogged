use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Measurement {
    #[serde(rename = "cup")]
    Cup,
    #[serde(rename = "ml")]
    ML,
}

impl From<String> for Measurement {
    fn from(s: String) -> Self {
        match s.as_str() {
            "cup" => Measurement::Cup,
            "ml" => Measurement::ML,
            _ => Measurement::ML, // Handle unknown cases
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Alert {
    #[serde(rename = "notify")]
    Notify,
    #[serde(rename = "alarm")]
    Alarm,
    #[serde(rename = "both")]
    Both,
    #[serde(rename = "none")]
    None,
}

impl ToString for Alert {
    fn to_string(&self) -> String {
        match self {
            Alert::Both => "both".to_string(),
            Alert::None => "none".to_string(),
            Alert::Alarm => "alarm".to_string(),
            Alert::Notify => "notify".to_string(),
        }
    }
}

impl From<String> for Alert {
    fn from(s: String) -> Self {
        match s.as_str() {
            "both" => Alert::Both,
            "none" => Alert::None,
            "alarm" => Alert::Alarm,
            "notify" => Alert::Notify,
            _ => Alert::Both,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SettingsConfig {
    pub goal: u32,
    pub amount: u32,
    pub interval: u32,
    pub enabled: bool,
    pub sound: String,
    pub end_time: String,
    pub alert_type: Alert,
    pub start_time: String,
    pub measurement: Measurement,
}
