use std::error::Error;
use tauri::App;

use crate::app::tray;
use crate::app::launcher;
use crate::app::shortcut;

pub const MAIN: &str = "main";

pub fn init(app: &mut App) -> Result<() , Box<dyn Error>> {
    tray::init(app)?;
    shortcut::init(app)?;
    launcher::init(app)?;

    Ok(())
}
