// 数据导入导出

import { store_book, store_global } from "./store/book";
import { store_setting } from "./store/setting";
import { store_state } from "./store/state";


/** 当前的数据版本 */
const version = "0.3";

/** 导出导入的数据类型 */
type Data = {
   version: string,
   data: {
      [id: string]: any
   }
}

// type ExportFn = (data: Data, configuration?: any) => undefined;
type ImportFn = (data: Data, configuration?: any) => undefined;

/** 输出json文件 */
export function export_data(configuration?: any) {

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
   const json = JSON.stringify(data);

}

/** 0.3 */
export namespace version_0_3 {

   export const _import: ImportFn = (data: Data, configuration?: any) => {
      const version = data.version;
      // 若存在下一个版本,则 类型变换后,调用下个版本的_import函数      
   }

}

