#[macro_use] extern crate serde_json;
#[macro_use] extern crate serde_derive;
extern crate rusqlite;
extern crate chrome_native_messaging;

mod config;
mod utils;
mod buku;
mod database;
mod server;

use buku::get_db_path;
use database::SqliteDatabase;
use server::Server;

fn main() {
    let path = get_db_path().unwrap();
    let db = SqliteDatabase::new(&path).unwrap();
    let server = Server::new(db);

    server.listen();
}
