use tauri::{State, App, AppHandle};
use tauri_plugin_autostart::{ManagerExt, AutoLaunchManager};

use crate::config::Config;

pub fn init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let manager = Launcher::new(app);
    manager.launch_at_start();

    Ok(())
}

pub struct Launcher<'a> {
    manager: State<'a, AutoLaunchManager>,
}

impl<'a> Launcher<'a> {
    pub fn new(app: &'a dyn AppOrHandle) -> Self {
        let manager = app.autolaunch();
        Self { manager }
    }

    pub fn launch_at_start(&self) -> bool {
        let data = Config::get_config().app;
        data.auto_launch
    }

    pub fn enable(&self) {
        self.manager.enable().unwrap();
    }

    pub fn disable(&self) {
        self.manager.disable().unwrap();
    }

    pub fn toggle(&self) {
        if self.launch_at_start() {
            self.disable();
        } else {
            self.enable();
        }
    }
}

// Trait to represent both App and AppHandle types
pub trait AppOrHandle {
    fn autolaunch(&self) -> State<AutoLaunchManager>;
}

impl AppOrHandle for App {
    fn autolaunch(&self) -> State<AutoLaunchManager> {
        ManagerExt::autolaunch(self)
    }
}

impl AppOrHandle for AppHandle {
    fn autolaunch(&self) -> State<AutoLaunchManager> {
        ManagerExt::autolaunch(self)
    }
}
