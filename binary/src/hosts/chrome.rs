// This host is usable for both Chrome and Chromium
#[derive(Serialize)]
pub struct ChromeHost {
    name: &'static str,
    description: &'static str,
    path: String,
    r#type: &'static str,
    allowed_origins: [&'static str; 1],
}

impl ChromeHost {
    pub fn new<T: Into<String>>(path: T) -> Self {
        ChromeHost {
            name: "com.samhh.bukubrow",
            description: "Bukubrow binary for the Chrome extension",
            path: path.into(),
            r#type: "stdio",
            allowed_origins: ["chrome-extension://ghniladkapjacfajiooekgkfopkjblpn/"],
        }
    }
}
