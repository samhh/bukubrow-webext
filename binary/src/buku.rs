use std::path::PathBuf;
use std::io;
use std::env;

// Determine path to database from environment variables
pub fn get_db_path() -> Result<PathBuf, io::Error> {
	let db_filename = "bookmarks.db";

    let dir: Result<PathBuf, env::VarError> = match env::var("XDG_DATA_HOME") {
        Ok(xdg_home) => { Ok(PathBuf::from(xdg_home + "/buku/")) },
        _ => {
            match env::var("HOME") {
                Ok(home) => { Ok(PathBuf::from(home + "/.local/share/buku/")) },
                Err(err) => Err(err),
            }
        },
    };

    if let Ok(mut path) = dir {
        path.set_file_name(db_filename);

        return Ok(path);
    } else {
        return Err(io::Error::new(io::ErrorKind::NotFound, "Failed to find Buku database."));
    }
}
