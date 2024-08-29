use serde::{Deserialize,Serialize};
use dirs;

pub mod app;
pub mod settings;

use app::AppConfig;
use settings::{Alert,SettingsConfig};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum ConfigKey {
    Sound,
    EndTime,
    Enabled,
    Interval,
    AlertType,
    StartTime,
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
    pub key: ConfigKey,
    pub value: ConfigValue,
}

#[derive(Debug, Deserialize, PartialEq, Serialize, Clone)]
pub struct Config {
    app: AppConfig,
    settings: SettingsConfig,
}

impl Config {
    pub fn new() -> Self {
        let default = Self::default_config();
        Self { ..default }
    }

    pub fn default_config() -> Self {
        Self {
            app: AppConfig { 
                auto_launch: true
            },
            settings: SettingsConfig {
                goal: 2500,
                interval: 45,
                enabled: true,
                sound: "bubble1".to_string(),
                end_time: "08:00".to_string(),
                start_time: "18:00".to_string(),
                alert_type: settings::Alert::Both,
                measurement: settings::Measurement::ML
            },
        }
    }

    pub fn create_config_dir() -> Result<String, std::io::Error> {
        if let Some(home_dir) = dirs::home_dir() {
            let config_dir = home_dir.join(".waterlogged");

            std::fs::create_dir_all(&config_dir)?;

            Ok(config_dir.to_string_lossy().into_owned())
        } else {
            Err(std::io::Error::new(std::io::ErrorKind::NotFound, "Home directory not found"))
        }
    }

    pub fn get_config_dir() -> Result<String, (usize, String)> {
        if let Some(home_dir) = dirs::home_dir() {
            let config_dir = home_dir.join(".waterlogged");

            if config_dir.exists() {
                Ok(config_dir.to_string_lossy().into_owned())
            } else {
                Self::create_config_dir().map_err(|e| (1, format!("Failed to create config folder: {}", e)))
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
                eprintln!("Error reading config file contents: {}. Resetting config...", e);
                "".to_string()
            }
        };

        // Return saved config data or reset config defaults
        match toml::from_str(&config_contents) {
            Ok(contents) => Config { ..contents },
            Err(_) => Config::new()
        }
    }

    pub fn toggle_auto_launch() {
        let auto_launch = Config::get_config().app.auto_launch;

        Self::update_config(
            ConfigUpdateAction { 
                key: ConfigKey::AutoLaunch,
                value: ConfigValue::Bool(!auto_launch)
            }
        );
    }

    pub fn update_config(new_state: ConfigUpdateAction) {
        let mut data = Self::get_config();

        match (new_state.key, new_state.value) {
            // settings
            (ConfigKey::Sound, ConfigValue::String(sound)) => data.settings.sound = sound,
            (ConfigKey::Enabled, ConfigValue::Bool(enabled)) => data.settings.enabled = enabled,
            (ConfigKey::EndTime, ConfigValue::String(end_time)) => data.settings.end_time = end_time,
            (ConfigKey::Interval, ConfigValue::Interval(interval)) => data.settings.interval = interval,
            (ConfigKey::StartTime, ConfigValue::String(start_time)) => data.settings.start_time = start_time,
            (ConfigKey::AlertType, ConfigValue::AlertType(alert_type)) => data.settings.alert_type = alert_type,

            // app
            (ConfigKey::AutoLaunch, ConfigValue::Bool(auto_launch)) => data.app.auto_launch = auto_launch,
            _ => ()
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
            },
            Err(e) => {
                eprintln!("Error serializing config data to toml: {}", e);
            }
        }
    }
}
