use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    App, Error as TauriError, Manager
};

pub fn init(app: &App) -> Result<(), TauriError> {
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
        .items(&[&relaunch, &show, &hide, &quit])
        .build()?;

    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/icons/128x128@2x.png");
    let icon = load_icon(std::path::Path::new(path)).unwrap();

    TrayIconBuilder::new()
        .icon(icon)
        .menu(&menu)
        .on_menu_event(move |app, event| {
            let window = app.get_webview_window("main").unwrap();

            match event.id().as_ref() {
                "relaunch" => app.restart(),
                "show" => window.show().unwrap(),
                "hide" => window.hide().unwrap(),
                "quit" => std::process::exit(0),
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}

fn load_icon(path: &std::path::Path) -> Result<tauri::image::Image, tauri::Error> {
    tauri::image::Image::from_path(path)
}
