// 数据导入导出

import { fetch } from "@tauri-apps/plugin-http";
import { save_export_file } from "./fs";
import { StoreBookData, StoreGlobalWordData, store_book, store_global } from "./store/book";
import { StoreSetting, set_label_for_setting, store_setting } from "./store/setting";
import { StoreState, store_state } from "./store/state";
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from "@tauri-apps/plugin-fs";
import { panic, todo } from "./auxiliary_fn";
import { batch } from "solid-js";
import { produce } from "solid-js/store";
import toast from "solid-toast";


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
         version: HistoryVersion._0_3_0,
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
   console.log(file);
   
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
       * 不出意外的话,configuration是不需要被修改的, configuration大部分是用户配置的
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
   handle_something(data: Data, configuration: {
      conservative: boolean
   } = {
         conservative: false
      }): undefined {
      const global = <StoreGlobalWordData>data.data[store_global.store_id]
      const book = <StoreBookData>data.data[store_book.store_id]
      const setting = <StoreSetting>data.data[store_setting.store_id] //无法处理,需要configuration(询问用户的需求)
      const state = <StoreState>data.data[store_state.store_id] //无法处理,需要configuration(询问用户的需求)
      if (configuration.conservative) {
         conservative_import_global(global);
         conservative_import_book(book);
         conservative_import_filter(setting);
      } else { // 非保守, 直接覆盖数据
         const [get_global, set_global] = store_global.render()
         const [get_book, set_book] = store_book.render()
         const [get_setting, set_setting] = store_setting.render()
         batch(() => {
            Object.keys(global).forEach(key => {
               set_global(key, global[key]);
            });
            Object.keys(book).forEach(key => {
               set_book(key, book[key]);
            })
            set_setting("recite", setting["recite"]);
            Object.keys(setting.label).forEach(label => {
               set_label_for_setting(label)
            })
            Object.keys(setting.filters).forEach(filter_key => {
               set_setting("filters", filter_key, setting["filters"][filter_key]);
            })
         })
      }

      /** 保守的导入global数据 
       * 尽可能保留最多非重复数据
      */
      function conservative_import_global(global: StoreGlobalWordData) {
         const [get, set] = store_global.render();
         batch(() => {
            Object.keys(global).forEach(key => {
               const a = global[key];
               set(key, produce(v => {
                  // 保守,不影响: note,star,yes,no,translation
                  // 影响: related_word,label,custom_translation
                  todo()
               }))
            })
         })
      }
      /** 保守的导入book数据 
       * 若单词本名重复,则不会导入, 以免破坏自己的单词本
      */
      function conservative_import_book(book: StoreBookData) {
         const [get, set] = store_book.render();
         batch(() => {
            Object.keys(book).forEach(key => {
               if (get[key] === undefined) {
                  set(key, book[key]);
               }
            })
         })
      }
      /** 保守的导入filter数据 
       * 若过滤器名重复,则不会导入, 以免破坏自己的过滤器
       */
      function conservative_import_filter(setting: StoreSetting) {
         const [get, set] = store_setting.render();
         batch(() => {
            Object.keys(setting.filters).forEach(key => {
               if (get.filters[key] === undefined) {
                  set("filters", key, setting.filters[key]);
               }
            })
         })
      }
      store_global.save();
      store_book.save();
      store_setting.save();
      store_state.save();
      toast.success("导入成功");
      console.log(store_book);
      
   }
};




