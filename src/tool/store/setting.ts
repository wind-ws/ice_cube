import { StoreFile, StoreValue } from "../store"
import { StoreFilter } from "../filter"
import { todo } from "../auxiliary_fn"
import { produce } from "solid-js/store"



export type StoreSetting = {
   recite: {
      /// true:自动发音
      is_auto_pronunciation: boolean,
      /// true:听单词模式 (hide界面会隐藏单词本身)
      is_listen_mode: boolean,
      /// true:自动展开 (等待设置的时常后,会自动进入show界面)
      is_auto_show: boolean,
      /// 当is_auto_show=true时,倒计时auto_show_sec秒后自动进入show界面
      auto_show_sec: number,
      /** 选择的单词书名 */
      book_name: string,
      /** 选择的过滤器名列表 */
      filter_name_list: string[],
   },
   /** 所有的过滤器 */
   filters: {
      [filter_name: string]: StoreFilter
   },
   /** 存在的标签 */
   readonly label: string[],
}

const default_store_setting = (): StoreSetting => {
   return {
      recite: {
         is_auto_pronunciation: true,
         is_listen_mode: false,
         is_auto_show: false,
         auto_show_sec: 4,
         book_name: "",
         filter_name_list: []
      },
      filters: {},
      label: []
   }
}

export const store_setting = new StoreValue(StoreFile.Setting, default_store_setting);

/** 安全的插入一个标签进入设置 */
export const set_label_for_setting = (label: string) => {
   const [get, set] = store_setting.render();
   if (!get.label.includes(label)) {//不存在
      set("label", get.label.length, label);
      store_setting.save_debounced_fn();
   }
}

export namespace setting_recite_fn {
   
   /** 切换单词本, 要把背诵状态清空 */
   export function set_book() {

   }

}

export namespace setting_filter_fn {

   /** 添加一个过滤器,若存在则覆盖 */
   export function add_filter(filter: StoreFilter) {
      const [get, set] = store_setting.render();
      set("filters", produce(v => {
         v[filter.name] = filter
      }));
      console.log(get);

      store_setting.save_debounced_fn();
   }

   function delete_filter(filter_name: string) {
      todo()
   }


}
