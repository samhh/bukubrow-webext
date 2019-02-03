#[macro_use]
extern crate serde_json;
#[macro_use]
extern crate serde_derive;

mod buku;
mod config;
mod database;
mod server;

use crate::database::SqliteDatabase;
use crate::server::Server;

fn main() {
    let path = buku::get_db_path().unwrap();
    let db = SqliteDatabase::new(&path).unwrap();
    let server = Server::new(db);

    server.listen();
}
