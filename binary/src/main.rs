extern crate rusqlite;
extern crate chrome_native_messaging;
#[macro_use] extern crate serde_json;
#[macro_use] extern crate serde_derive;

use std::error::Error;
use std::env;
use std::io;
use rusqlite::{Connection, Error as DbError};
use chrome_native_messaging::{event_loop, write_output, errors};

const VERSION: &'static str = "1.1.0";

#[derive(Serialize, Deserialize)]
struct Bookmark {
    id: Option<i32>,
    url: String,
    metadata: String,
    tags: String,
    desc: String,
    flags: i32,
}

#[derive(Serialize, Deserialize)]
struct RequestData {
    bookmark: Option<Bookmark>,
    bookmark_id: Option<i32>,
}

#[derive(Serialize, Deserialize)]
struct Request {
    method: String,
    data: Option<RequestData>,
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
// TODO prepare is deprecated
// TODO also update deps
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

fn add_bookmark(db: &Connection, bm: &Bookmark) -> bool {
    let query = "INSERT INTO bookmarks(metadata, desc, tags, url, flags) VALUES (?1, ?2, ?3, ?4, ?5)";
    let exec = db.execute(query, &[&bm.metadata, &bm.desc, &bm.tags, &bm.url, &bm.flags]);

    exec.is_ok()
}

fn update_bookmark(db: &Connection, bm: &Bookmark) -> bool {
    let query = "UPDATE bookmarks SET (metadata, desc, tags, url, flags) = (?2, ?3, ?4, ?5, ?6) WHERE id = ?1";
    let exec = db.execute(query, &[&bm.id.unwrap(), &bm.metadata, &bm.desc, &bm.tags, &bm.url, &bm.flags]);

    exec.is_ok()
}

fn delete_bookmark(db: &Connection, bm_id: i32) -> bool {
    let query = "DELETE FROM bookmarks WHERE id = ?1";
    let exec = db.execute(query, &[&bm_id]);

    exec.is_ok()
}

fn main() {
    let db_path = get_db_path();
    let db_conn = Connection::open(db_path).unwrap();

    event_loop(|req_json: serde_json::Value| -> Result<(), errors::Error> {
        let req: Request = serde_json::from_value(req_json)?;

        let res: serde_json::Value = {
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
                "OPTIONS" => {
                    json!({
                        "success": true,
                        "binaryVersion": VERSION,
                    })
                }
                "POST" => {
                    let bm = req.data.unwrap().bookmark.unwrap();

                    let success = add_bookmark(&db_conn, &bm);

                    json!({
                        "success": success,
                    })
                }
                "PUT" => {
                    let bm = req.data.unwrap().bookmark.unwrap();

                    let success = bm.id.is_some() && update_bookmark(&db_conn, &bm);

                    json!({
                        "success": success
                    })
                }
                "DELETE" => {
                    let bm_id = req.data.unwrap().bookmark_id.unwrap();

                    let success = delete_bookmark(&db_conn, bm_id);

                    json!({
                        "success": success
                    })
                }
                _ => {
                    json!({
                        "success": false,
                        "message": "Unrecognised request type.",
                    })
                }
            }
        };

        write_output(io::stdout(), &res)?;

        Ok(())
    });
}
