// 数据导入导出

import { fetch } from "@tauri-apps/plugin-http";
import { save_export_file } from "./fs";
import { store_book, store_global } from "./store/book";
import { store_setting } from "./store/setting";
import { store_state } from "./store/state";
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from "@tauri-apps/plugin-fs";
import { panic } from "./auxiliary_fn";


enum HistoryVersion {
   _0_3_0 = "0.3.0",
}

/** 当前的数据版本,版本号不与APP版本完全同步,只在数据变更后,同步到APP版本 */
const version = HistoryVersion._0_3_0;



/** 导出导入的数据类型 */
export type Data = {
   version: HistoryVersion,
   data: {
      [id: string]: any
   }
}


/** 输出json文件 
 * 不能随意调整这个函数,调整后 需要变更版本号
*/
export function export_data(configuration?: any) {
   export_fn[version].export_data(configuration);
}

/** 导出函数 , 记录一下每个版本的导出函数 ,方便对每个导入函数做迁移处理 */
const export_fn: {
   /* [version:HistoryVersion] */
   [version: string]: {
      export_data(configuration?: any): undefined
   }
} = {};
export_fn[HistoryVersion._0_3_0] = {
   export_data(configuration: { file_name: string }): undefined {
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
      store_state.save();
      data.data[store_state.store_id] = store_state.data;

      save_export_file(configuration.file_name, data);
   }
}


/** 导入json文件 */
export async function import_data(configuration?: any) {
   let data = await select_import_file();

   for (let index = 0; true; index++) {
      if (data.version != version) {// 进行数据迁移
         const { data: d, configuration: c } =
            import_fn[data.version].migrate(data, configuration);
         data = d;
         configuration = c;
      }
      if (data.version == version) {
         break;
      }
      if (index == 100) {
         panic("import_data函数存在bug,导致循环过度");
      }
   }
   import_fn[data.version].handle_something(data, configuration);
}

async function select_import_file(): Promise<Data> {
   const file = await open({
      multiple: false,
      directory: false,
   })
   const path: string = file?.path as any;
   const a = await readTextFile(path);
   const data: Data = JSON.parse(a);
   return data;
}


/** 导入函数们, 版本操作和迁移函数 */
const import_fn: {
   /* [version:HistoryVersion] */
   [version: string]: {
      /** 数据迁移函数 
       * 输入 上个版本数据 返回 当前版本数据(值的是[version: string]这个版本) 
       * 注意: 你需要在函数中将 data.version 修改为这个版本[version: string]
      */
      migrate(last_version_data: Data, configuration?: any): { data: Data, configuration: any },
      /** 做一些导入数据该做的事 */
      handle_something(data: Data, configuration?: any): undefined
   }
} = {};
import_fn[HistoryVersion._0_3_0] = {
   migrate(last_version_data: Data, configuration?: any): { data: Data, configuration: any } {
      const data: Data = {
         version: HistoryVersion._0_3_0,
         data: {
            // 第一个版本有个鸡毛的需要迁移
         }
      }
      return { data, configuration }
   },
   handle_something(data: Data, configuration?: any): undefined {
      //todo
   }
};


