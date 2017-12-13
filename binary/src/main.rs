extern crate rusqlite;
extern crate chrome_native_messaging;
#[macro_use] extern crate serde_json;
#[macro_use] extern crate serde_derive;

use std::error::Error;
use std::env;
use std::io;
use rusqlite::{Connection, Error as DbError};
use chrome_native_messaging::{event_loop, write_output, errors};

#[derive(Serialize)]
struct Bookmark {
    id: i32,
    url: String,
    metadata: String,
    tags: String,
    desc: String,
    flags: i32,
}

#[derive(Serialize, Deserialize)]
struct Request {
    method: String,
}

// Determine path to database from environment variables
fn get_db_path() -> String {
	let db_filename = "bookmarks.db";

    let dir = match env::var("XDG_DATA_HOME") {
        Ok(xdg_home) => { xdg_home + "/buku/" }
        _ => {
            match env::var("HOME") {
                Ok(home) => { home + "/.local/share/buku/" }
                Err(err) => panic!("Failed to access any compatible environment variables: {}", err)
            }
        }
    };

	return dir + db_filename;
}

// Get bookmarks from database
fn get_bookmarks(db: &Connection) -> Result<Vec<Bookmark>, DbError> {
    let query = "SELECT * FROM bookmarks;";
    let mut stmt = db.prepare(query).unwrap();

    let rows = stmt.query_map(&[], |row| {
        Bookmark {
            id: row.get(0),
            url: row.get(1),
            metadata: row.get(2),
            tags: row.get(3),
            desc: row.get(4),
            flags: row.get(5),
        }
    })?;

    let mut bookmarks = Vec::new();
    for bookmark in rows {
        bookmarks.push(bookmark?);
    }

    Ok(bookmarks)
}

fn main() {
    let db_path = get_db_path();
    let db_conn = Connection::open(db_path).unwrap();

    event_loop(|req_json: serde_json::Value| -> Result<(), errors::Error> {
        let req: Result<Request, serde_json::Error> = serde_json::from_value(req_json);

        let res: serde_json::Value = if req.is_ok() {
            let req = req.unwrap();

            match req.method.as_ref() {
                "GET" => {
                    let bookmarks = get_bookmarks(&db_conn);

                    match bookmarks {
                        Ok(bm) => {
                            json!({
                                "success": true,
                                "bookmarks": bm,
                            })
                        }
                        Err(err) => {
                            json!({
                                "success": false,
                                "message": err.description(),
                            })
                        }
                    }
                }
                _ => {
                    json!({
                        "success": false,
                        "message": "Unrecognised request type.",
                    })
                }
            }
        } else {
            json!({
                "success": false,
                "message": "Failed to read incoming JSON.",
            })
        };

        write_output(io::stdout(), &res).unwrap();

        Ok(())
    });
}
