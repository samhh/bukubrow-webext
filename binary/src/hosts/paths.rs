use os_info::Type as OsType;
use std::path::PathBuf;

#[derive(Debug)]
pub enum Browser {
    Chrome,
    Chromium,
    Firefox,
}

pub fn get_host_path(browser: &Browser) -> Result<PathBuf, &'static str> {
    let os_type = os_info::get().os_type();

    let home_dir = dirs::home_dir().ok_or("Failed to determine path to home directory.")?;
    let nm_dir_from_home = match (os_type, browser) {
        (OsType::Linux, Browser::Chrome) => Ok(".config/google-chrome/NativeMessagingHosts/"),
        (OsType::Linux, Browser::Chromium) => Ok(".config/chromium/NativeMessagingHosts/"),
        (OsType::Linux, Browser::Firefox) => Ok(".mozilla/native-messaging-hosts/"),
        (OsType::Macos, Browser::Chrome) => {
            Ok("Library/Application Support/Google/Chrome/NativeMessagingHosts/")
        }
        (OsType::Macos, Browser::Chromium) => {
            Ok("Library/Application Support/Chromium/NativeMessagingHosts/")
        }
        (OsType::Macos, Browser::Firefox) => {
            Ok("Library/Application Support/Mozilla/NativeMessagingHosts/")
        }
        (OsType::Windows, _) => Err("Windows is not yet supported."),
        _ => Err("Unrecognised operating system."),
    }?;

    Ok(home_dir.join(nm_dir_from_home))
}
