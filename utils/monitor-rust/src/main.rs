extern crate ansi_term;
extern crate chrono;
extern crate curl;

#[macro_use]
extern crate log;
extern crate env_logger;

use std::env;
use std::thread;
use std::time::Duration;

use ansi_term::Colour::{Red, Green};
use chrono::Local;
use curl::http;

fn main() {

    env_logger::init().unwrap();

    info!("starting up");

    let auth = match env::var("AUTH") {
        Ok(val) => val,
        Err(_) => panic!("No AUTH"),
    };

    loop {
        let resp = http::handle()
                       .get("https://v2.freeaddr.info")
                       .header("Authorization", auth.as_str())
                       .exec()
                       .unwrap();

        let status_code = resp.get_code();

        let dt = Local::now();
        let format = dt.format("%Y-%m-%d %H:%M:%S").to_string();
        println!("{} {}",
                 format,
                 if status_code == 200 {
                     Green.paint(status_code.to_string())
                 } else {
                     Red.paint(status_code.to_string())
                 });

        thread::sleep(Duration::from_secs(10 * 60))
    }
}
