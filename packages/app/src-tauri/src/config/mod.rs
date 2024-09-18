use dirs;
use serde::{Deserialize, Serialize};
use serde_json::Value;

pub mod app;
pub mod settings;

use app::AppConfig;
use settings::{Alert, Measurement, SettingsConfig};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ConfigKey {
    #[serde(rename = "sound")]
    Sound,
    #[serde(rename = "end_time")]
    EndTime,
    #[serde(rename = "enabled")]
    Enabled,
    #[serde(rename = "interval")]
    Interval,
    #[serde(rename = "alert_type")]
    AlertType,
    #[serde(rename = "start_time")]
    StartTime,
    #[serde(rename = "auto_launch")]
    AutoLaunch,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ConfigValue {
    Bool(bool),
    String(String),
    Interval(u32),
    AlertType(Alert),
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ConfigUpdateAction {
    pub key: String,
    pub value: Value,
}

#[derive(Debug, Deserialize, PartialEq, Serialize, Clone)]
pub struct Config {
    pub app: AppConfig,
    pub settings: SettingsConfig,
}

impl Config {
    pub fn new() -> Self {
        let default = Self::default_config();
        Self { ..default }
    }

    pub fn default_config() -> Self {
        Self {
            app: AppConfig { auto_launch: true },
            settings: SettingsConfig {
                goal: 2500,
                amount: 250,
                interval: 45,
                enabled: true,
                sound: "bubble1".to_string(),
                end_time: "08:00".to_string(),
                start_time: "18:00".to_string(),
                alert_type: Alert::from(Alert::Both),
                measurement: Measurement::from(Measurement::ML),
            },
        }
    }

    pub fn create_config_dir() -> Result<String, std::io::Error> {
        if let Some(home_dir) = dirs::home_dir() {
            let config_dir = home_dir.join(".waterlogged");

            std::fs::create_dir_all(&config_dir)?;

            Ok(config_dir.to_string_lossy().into_owned())
        } else {
            Err(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "Home directory not found",
            ))
        }
    }

    pub fn get_config_dir() -> Result<String, (usize, String)> {
        if let Some(home_dir) = dirs::home_dir() {
            let config_dir = home_dir.join(".waterlogged");

            if config_dir.exists() {
                Ok(config_dir.to_string_lossy().into_owned())
            } else {
                Self::create_config_dir()
                    .map_err(|e| (1, format!("Failed to create config folder: {}", e)))
            }
        } else {
            Err((2, "No home directory".to_string()))
        }
    }

    pub fn get_config() -> Self {
        let config_dir = Self::get_config_dir().unwrap();
        let config_file_path = std::path::Path::new(&config_dir).join("config.toml");

        if !config_file_path.exists() {
            std::fs::File::create(&config_file_path).expect("File creation error");
        }

        // Get file contents or blank it out
        let config_contents = match std::fs::read_to_string(&config_file_path) {
            Ok(contents) => contents,
            Err(e) => {
                eprintln!(
                    "Error reading config file contents: {}. Resetting config...",
                    e
                );
                "".to_string()
            }
        };

        // Return saved config data or reset config defaults
        match toml::from_str(&config_contents) {
            Ok(contents) => Config { ..contents },
            Err(_) => Config::new(),
        }
    }

    pub fn set_auto_launch(auto_launch: bool) {
        Self::update_config(ConfigUpdateAction {
            key: "auto_launch".to_string(),
            value: Value::Bool(auto_launch),
        })
    }

    pub fn update_settings(settings: SettingsConfig) {
        let mut data = Self::get_config();
        data.settings = settings;

        Self::write_to_config(data.clone())
    }

    pub fn update_config(new_state: ConfigUpdateAction) {
        let mut data = Self::get_config();

        match new_state.key.as_str() {
            // settings
            "sound" => {
                if let Value::String(sound) = new_state.value {
                    data.settings.sound = sound
                }
            }
            "enabled" => {
                if let Value::Bool(enabled) = new_state.value {
                    data.settings.enabled = enabled
                }
            }
            "interval" => {
                if let Value::Number(interval) = new_state.value {
                    if let Some(interval) = interval.as_u64() {
                        data.settings.interval = interval as u32
                    }
                }
            }
            "end_time" => {
                if let Value::String(end_time) = new_state.value {
                    data.settings.end_time = end_time
                }
            }
            "start_time" => {
                if let Value::String(start_time) = new_state.value {
                    data.settings.start_time = start_time
                }
            }
            "alert_type" => {
                if let Value::String(alert_type) = new_state.value {
                    data.settings.alert_type = Alert::from(alert_type);
                }
            }

            // app
            "auto_launch" => {
                if let Value::Bool(auto_launch) = new_state.value {
                    data.app.auto_launch = auto_launch
                }
            }
            _ => {}
        }

        Self::write_to_config(data.clone())
    }

    pub fn write_to_config(data: Config) {
        let config_dir = Self::get_config_dir().unwrap();
        let file_path = std::path::Path::new(&config_dir).join("config.toml");

        if !file_path.exists() {
            std::fs::File::create(&file_path).expect("create config failed");
        }

        match toml::to_string(&data) {
            Ok(content) => {
                if let Err(e) = std::fs::write(&file_path, content) {
                    eprintln!("Error writing to config file: {}", e);
                }
            }
            Err(e) => {
                eprintln!("Error serializing config data to toml: {}", e);
            }
        }
    }
}
