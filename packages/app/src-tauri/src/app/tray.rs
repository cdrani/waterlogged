use tauri::{
    menu::{MenuBuilder, MenuEvent, MenuItemBuilder},
    tray::TrayIconBuilder,
    App, AppHandle, Error as TauriError, Manager,
};

use crate::app::launcher::Launcher;

use super::worker::{AsyncWorker, WorkerEvent};

pub fn init(app: &App) -> Result<(), TauriError> {
    let auto_launch = MenuItemBuilder::with_id("auto_launch", "Toggle Auto Launch")
        .accelerator("Cmd+A")
        .build(app)?;
    let show = MenuItemBuilder::with_id("show", "Show")
        .accelerator("Cmd+S")
        .build(app)?;
    let hide = MenuItemBuilder::with_id("hide", "Hide")
        .accelerator("Cmd+H")
        .build(app)?;
    let quit = MenuItemBuilder::with_id("quit", "Quit")
        .accelerator("Cmd+Q")
        .build(app)?;
    let relaunch = MenuItemBuilder::with_id("relanuch", "Relaunch")
        .accelerator("Cmd+L")
        .build(app)?;

    let menu = MenuBuilder::new(app)
        .items(&[&auto_launch, &relaunch, &show, &hide, &quit])
        .build()?;

    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/icons/128x128@2x.png");
    let icon = load_icon(std::path::Path::new(path)).unwrap();

    TrayIconBuilder::new()
        .icon(icon)
        .menu(&menu)
        .on_menu_event(move |app, event| {
            let worker = app.state::<AsyncWorker>();
            handle_event(app, event, &worker);
        })
        .build(app)?;

    Ok(())
}

fn handle_event(app: &AppHandle, event: MenuEvent, worker: &AsyncWorker) {
    let window = app.get_webview_window("main").unwrap();

    match event.id().as_ref() {
        "relaunch" => app.restart(),
        "show" => window.show().unwrap(),
        "hide" => window.hide().unwrap(),
        "quit" => std::process::exit(0),
        "auto_launch" => {
            let launcher = Launcher::new(app);
            launcher.toggle();

            let worker_clone = worker.clone();
            tauri::async_runtime::spawn(async move {
                worker_clone.send_event(WorkerEvent::ToggleAutoLaunch).await;
            });
        }
        _ => {}
    }
}

fn load_icon(path: &std::path::Path) -> Result<tauri::image::Image, tauri::Error> {
    tauri::image::Image::from_path(path)
}
