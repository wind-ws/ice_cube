import { StoreFile, StoreValue } from "../store"
import { StoreFilter } from "../filter"
import { todo } from "../auxiliary_fn"
import { produce } from "solid-js/store"

import { Option, none } from "../option"

export type StoreSetting = {
   recite: {
      /** 选择的单词书名 */
      book_name: string,
      /** 选择的过滤器名列表 */
      filter_name_list: string[],
      /// true:自动发音
      is_auto_pronunciation: boolean,
      /// true:听单词模式 (hide界面会隐藏单词本身)
      is_listen_mode: boolean,
      /// true:自动展开 (等待设置的时常后,会自动进入show界面)
      is_auto_show: boolean,
      /// 当is_auto_show=true时,倒计时auto_show_sec秒后自动进入show界面
      auto_show_sec: number,
      /** 拼写模式 */
      spelling: boolean,

   },
   /** 所有的过滤器 */
   filters: {
      [filter_name: string]: StoreFilter
   },
   api: {
      /** 使用中的发音api ,the value is audio_api_name */
      use_audio_url: Option<string>,
      /** 获取单词发音的api 
       * 和 translation_word_url 类似的
      */
      audio_url: {
         [audio_api_name: string]: {
            url: string,//api地址
            word: never,//必要的,不可被覆盖
            other_options: {
               [_: string]: string
            }
         }
      },
      /** 使用中的翻译api, the value is translation_word_api_name */
      use_translation_word_url: Option<string>
      /** 获取单词翻译的api 
       * 提取 "${word}"(必要的,),"${key}"(自定义的),"${any name}"(会进行分析提取,出现输入框) 进行替换, 
       * 例如:"http://abc?word=${word}"
      */
      translation_word_url: {
         [translation_word_api_name: string]: {
            url: string,//api地址
            word: never,//必要的,不可被覆盖
            other_options: {
               [_: string]: string
            }
         }
      }
   }
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
         filter_name_list: [],
         spelling: false
      },
      filters: {},
      api: {
         use_audio_url: none(),
         audio_url: {},
         use_translation_word_url: none(),
         translation_word_url: {},
      },
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
