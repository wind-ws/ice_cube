import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";


const default_key = StoreFile.Setting;
const store = new Store(StoreFile.Setting);

type StoreSetting = {
   /// true:自动发音
   is_auto_pronunciation: boolean,
   /// true:听单词模式 (hide界面会隐藏单词本身)
   is_listen_mode: boolean,
   /// true:自动展开 (等待设置的时常后,会自动进入show界面)
   is_auto_show: boolean,
   /// 当is_auto_show=true时,倒计时auto_show_sec秒后自动进入show界面
   auto_show_sec: number,

}
const default_store_setting = (): StoreSetting => {
   return {
      is_auto_pronunciation: true,
      is_listen_mode: false,
      is_auto_show: false,
      auto_show_sec: 4,
   }
}

export const store_setting: {
   value: StoreValue<StoreSetting>,
} = {
   value: new StoreValue(store, default_key, default_store_setting,true,true),
}
