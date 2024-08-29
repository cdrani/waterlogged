use std::error::Error;
use tauri::App;

use crate::app::tray;

pub fn init(app: &mut App) -> Result<() , Box<dyn Error>> {
    tray::init(app)?;

    Ok(())
}
