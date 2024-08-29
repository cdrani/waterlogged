#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod app;
mod cmd;
mod config;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(app::setup::init)
        .invoke_handler(tauri::generate_handler![cmd::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
