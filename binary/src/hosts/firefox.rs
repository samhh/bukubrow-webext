#[derive(Serialize)]
pub struct FirefoxHost {
    name: &'static str,
    description: &'static str,
    path: String,
    r#type: &'static str,
    allowed_extensions: [&'static str; 1],
}

impl FirefoxHost {
    pub fn new<T: Into<String>>(path: T) -> Self {
        FirefoxHost {
            name: "com.samhh.bukubrow",
            description: "Bukubrow binary for the Firefox extension",
            path: path.into(),
            r#type: "stdio",
            allowed_extensions: ["bukubrow@samhh.com"],
        }
    }
}
