use crate::config::Config;
use tauri::{Window, WindowEvent, LogicalSize, PhysicalSize, Manager};
use crate::app::setup::MAIN;

fn resize_webview(window: &Window, dimensions: PhysicalSize<u32>, scale_f: f64) {
    let main = window.get_webview_window(MAIN).unwrap();

    main
        .set_size(LogicalSize {
            width: (dimensions.width as f64 / scale_f),
            height: (dimensions.height as f64 / scale_f),
        })
        .unwrap();
}

pub fn init(window: &Window, event: &WindowEvent) {
    match event {
        WindowEvent::CloseRequested { api, .. } => {
            let auto_launch = Config::get_config().app.auto_launch;

            if auto_launch {
                api.prevent_close();
                window.hide().unwrap();
            } else {
                std::process::exit(0);
            }
        },
        WindowEvent::ScaleFactorChanged {
            scale_factor,
            new_inner_size,
            ..
        } => {
            resize_webview(window, *new_inner_size, *scale_factor);
        }
        _ => {}
    };
}
