#![feature(cfg_match)]

use std::{
    fs::{self, File},
    io::Write,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
/// to /storage/emulated/0/Download/IceCube
fn save_file_to_downlaod(file_name: &str, str: &str) {
    let file_path = if cfg!(target_os = "android") {
        fs::create_dir("/storage/emulated/0/Download/IceCube/");
        format!("/storage/emulated/0/Download/IceCube/{}", file_name)
    } else if cfg!(target_os = "ios") {
        todo!();
        String::new()
    } else {
        panic!("expected target os")
    };
    let mut file = File::create(&file_path).unwrap();
    file.write_all(str.as_bytes()).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init()) //因为 官方配置文件的问题 暂时不能使用http, 等待官方的更新 https://github.com/tauri-apps/plugins-workspace/issues/1055
        .plugin(tauri_plugin_store::Builder::default().build())
        // .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![save_file_to_downlaod])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
