use rusqlite::{types::ToSql, Connection, Error as DbError, NO_PARAMS};
use std::path::PathBuf;

pub type BookmarkId = i32;

#[derive(Serialize, Deserialize)]
pub struct Bookmark {
    pub id: Option<BookmarkId>,
    url: String,
    metadata: String,
    tags: String,
    desc: String,
    flags: i32,
}

pub struct SqliteDatabase {
    connection: Connection,
}

impl SqliteDatabase {
    // Initiate connection to Sqlite database at specified path
    pub fn new(path: &PathBuf) -> Result<Self, DbError> {
        let connection = Connection::open(&path)?;

        let instance = SqliteDatabase { connection };

        Ok(instance)
    }

    // Get bookmarks from database
    pub fn get_bookmarks(&self) -> Result<Vec<Bookmark>, DbError> {
        let query = "SELECT * FROM bookmarks;";
        let mut stmt = self.connection.prepare(query)?;

        let rows = stmt.query_map(NO_PARAMS, |row| Bookmark {
            id: row.get(0),
            url: row.get(1),
            metadata: row.get(2),
            tags: row.get(3),
            desc: row.get(4),
            flags: row.get(5),
        })?;

        let bookmarks: Vec<Bookmark> = rows.filter_map(|x| x.ok()).collect();

        Ok(bookmarks)
    }

    // Save bookmark to database
    pub fn add_bookmark(&self, bm: &Bookmark) -> Result<usize, DbError> {
        let query =
            "INSERT INTO bookmarks(metadata, desc, tags, url, flags) VALUES (?1, ?2, ?3, ?4, ?5);";
        let exec = self.connection.execute(
            query,
            &[
                &bm.metadata,
                &bm.desc,
                &bm.tags,
                &bm.url,
                &bm.flags as &ToSql,
            ],
        );

        exec
    }

    // Update bookmark in database by ID
    pub fn update_bookmark(&self, bm: &Bookmark) -> Result<usize, DbError> {
        let query = "UPDATE bookmarks SET (metadata, desc, tags, url, flags) = (?2, ?3, ?4, ?5, ?6) WHERE id = ?1;";
        let exec = self.connection.execute(
            query,
            &[
                &bm.id.unwrap(),
                &bm.metadata as &ToSql,
                &bm.desc,
                &bm.tags,
                &bm.url,
                &bm.flags,
            ],
        );

        exec
    }

    // Delete bookmark from database by ID
    pub fn delete_bookmark(&self, bm_id: &BookmarkId) -> Result<usize, DbError> {
        let query = "DELETE FROM bookmarks WHERE id = ?1;";
        let exec = self.connection.execute(query, &[bm_id]);

        exec
    }
}
