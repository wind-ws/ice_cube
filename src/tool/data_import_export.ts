// 数据导入导出

import { fetch } from "@tauri-apps/plugin-http";
import { save_export_file } from "./fs";
import { store_book, store_global } from "./store/book";
import { store_setting } from "./store/setting";
import { store_state } from "./store/state";
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from "@tauri-apps/plugin-fs";

/** 当前的数据版本,版本号不与APP版本完全同步,只在数据变更后,同步到APP版本 */
const version = "0.3";

/** 导出导入的数据类型 */
export type Data = {
   version: string,
   data: {
      [id: string]: any
   }
}

// type ExportFn = (data: Data, configuration?: any) => undefined;
type ImportFn = (configuration?: any) => Promise<any>;


/** 输出json文件 */
export function export_data(configuration?: any | { file_name: string }) {

   const data: Data = {
      version: version,
      data: {}
   }
   store_global.save();
   data.data[store_global.store_id] = store_global.data;
   store_book.save();
   data.data[store_book.store_id] = store_book.data;
   store_setting.save();
   data.data[store_setting.store_id] = store_setting.data;
   // store_state.save();
   // data.data[store_state.store_id] = store_state.data;

   save_export_file(configuration.file_name, data);
}


/** 0.3 */
export namespace version_0_3 {

   // 问题追踪: https://github.com/tauri-apps/tauri/issues/9083
   //    https://github.com/tauri-apps/tauri/pull/9311
   // 似乎在新版本被解决了
   export const _import: ImportFn = async (configuration?: any) => {
      // const version = data.version;
      const file = await open({
         multiple: false,
         directory: false,
      })
      console.log(file);
      const path: string = file?.path as any;
      const a = await readTextFile(path);
      console.log(a);
      
      // 若存在下一个版本,则 类型变换后,调用下个版本的_import函数      
   }

}

