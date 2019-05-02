use super::chrome::ChromeHost;
use super::firefox::FirefoxHost;
use super::paths::{get_host_path, Browser};
use std::fs;
use std::io::Write;
use std::path::PathBuf;

const NM_FILENAME: &'static str = "com.samhh.bukubrow.json";

pub fn install_host(browser: &Browser) -> Result<(), &'static str> {
    // Create native messaging path if it doesn't already exist
    let host_path = get_host_path(&browser)?;
    fs::create_dir_all(&host_path).map_err(|_| "Failed to create native messaging directory.")?;

    // Determine path of self/binary
    let exe_err_str = "Could not determine location of Bukubrow binary.";
    let exe_path = std::env::current_exe()
        .map_err(|_| exe_err_str)
        .and_then(|path| path.into_os_string().into_string().map_err(|_| exe_err_str))?;

    // Create JSON file
    let full_write_path = PathBuf::from(host_path).join(NM_FILENAME);
    let mut file =
        fs::File::create(full_write_path).map_err(|_| "Failed to create browser host file.")?;

    // Write to created file
    let write = match browser {
        Browser::Chrome | Browser::Chromium => file.write_all(
            &serde_json::to_string(&ChromeHost::new(exe_path))
                .map_err(|_| "Failed to serialise Chrome/Chromium browser host.")?
                .as_bytes(),
        ),
        Browser::Firefox => file.write_all(
            &serde_json::to_string(&FirefoxHost::new(exe_path))
                .map_err(|_| "Failed to serialise Firefox browser host.")?
                .as_bytes(),
        ),
    }
    .map_err(|_| "Failed to write to browser host file.");

    write
}
