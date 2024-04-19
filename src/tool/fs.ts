import { invoke } from "@tauri-apps/api/core";
import { Data } from "./data_import_export";



/** 将文件保存在系统下载目录中 */
function save_file_to_download(file_name: string, data: string) {
   invoke("save_file_to_downlaod",
      { fileName: file_name, str: data })
      .then(v => {
         console.log(`the file ${file_name} saved in system downlaod directory`);
      })
}

/** 保存导出的数据文件 
 * 文件名格式: [file_name]+"_"+[version]+".json"
*/
export function save_export_file(file_name: string, data: Data) {
   file_name = file_name + "_" + data.version + ".json";
   const json = JSON.stringify(data);
   save_file_to_download(file_name, json);
}

