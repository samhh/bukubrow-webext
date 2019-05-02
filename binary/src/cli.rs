use crate::hosts::paths::Browser;
use clap::{crate_authors, crate_name, crate_version, App, Arg, Error};

pub fn init() -> Result<Vec<Browser>, Error> {
    let chrome_arg = "chrome";
    let chromium_arg = "chromium";
    let firefox_arg = "firefox";

    let matches = App::new(crate_name!())
        .version(crate_version!())
        .author(crate_authors!())
        .about("Bukubrow native messaging host installer")
        .arg(
            Arg::with_name(chrome_arg)
                .long("--install-chrome")
                .help("Install the native messaging host for Chrome."),
        )
        .arg(
            Arg::with_name(chromium_arg)
                .long("--install-chromium")
                .help("Install the native messaging host for Chromium."),
        )
        .arg(
            Arg::with_name(firefox_arg)
                .long("--install-firefox")
                .help("Install the native messaging host for Firefox."),
        )
        .get_matches_safe()?;

    let install_chrome = matches.is_present(chrome_arg);
    let install_chromium = matches.is_present(chromium_arg);
    let install_firefox = matches.is_present(firefox_arg);

    let mut to_install = Vec::with_capacity(3);

    if install_chrome {
        to_install.push(Browser::Chrome);
    }
    if install_chromium {
        to_install.push(Browser::Chromium);
    }
    if install_firefox {
        to_install.push(Browser::Firefox);
    }

    Ok(to_install)
}
