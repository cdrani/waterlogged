use std::error::Error;
use tauri::{Manager, App, LogicalSize};

use crate::app::tray;
use crate::app::launcher;
use crate::app::shortcut;
use crate::app::worker::Worker;

pub const MAIN: &str = "main";

pub fn init(app: &mut App) -> Result<() , Box<dyn Error>> {
    tray::init(app)?;
    shortcut::init(app)?;
    launcher::init(app)?;

    let (mut worker, async_worker) = Worker::new(app.handle().clone());

    app.manage(async_worker);

    worker.listen();

    tauri::async_runtime::spawn(async move {
        worker.start_notifier().await;
    });

    let window = app.get_webview_window(MAIN).unwrap();
    window.set_size(LogicalSize { width: 320.0, height: 500.0 }).unwrap();

    Ok(())
}
