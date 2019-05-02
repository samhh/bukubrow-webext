#[macro_use]
extern crate serde_json;
#[macro_use]
extern crate serde_derive;

mod buku;
mod cli;
mod database;
mod hosts;
mod server;

use crate::database::SqliteDatabase;
use crate::hosts::installer::install_host;
use crate::server::Server;
use clap::ErrorKind;

fn main() {
    // Native messaging can provide its own arguments we don't care about, so
    // ignore any unrecognised arguments
    let args = cli::init().unwrap_or_else(|err| match err.kind {
        ErrorKind::HelpDisplayed | ErrorKind::VersionDisplayed => err.exit(),
        _ => Vec::new(),
    });

    // If installation arguments are supplied then assume we're installing
    // instead of messaging, so install all requested and exit
    if !args.is_empty() {
        for browser in args {
            let installed = install_host(&browser);

            if installed.is_err() {
                println!(
                    "Failed to install host for {:?}: {:?}",
                    &browser,
                    installed.unwrap()
                );
                std::process::exit(1);
            }
        }

        std::process::exit(0);
    }

    // No installation arguments supplied, proceed with native messaging
    let path = buku::get_db_path().unwrap();
    let db = SqliteDatabase::new(&path).unwrap();
    let server = Server::new(db);

    server.listen();
}
