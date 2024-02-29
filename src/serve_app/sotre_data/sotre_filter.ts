import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";
import { StoreFilter } from "../filter";
import { Option, none, some } from "../../tool/option";

const default_key = StoreFile.Filter;
const store = new Store(StoreFile.Filter);


/// 存储实体
/// 存储所有过滤器数据
export const store_filter : {
   value:StoreValue<{[name:string]:StoreFilter}>,
   get_filter(name:string):Option<StoreFilter>,
   set_filter(filter:StoreFilter):void,
   get_all_filter_name():string[],
   delete_filter(name:string):void,
   // delete_all_filter():void,//删除所有过滤器(这只是一个为了方便而出现的函数,未来它不应该存在)
} = {
   value: new StoreValue(store, default_key, () => ({}), true, true),
   get_filter(name: string): Option<StoreFilter> {
      if (this.value.value[name] == undefined) {
         return none();
      } else {
         return some(this.value.value[name]);
      }
   },
   set_filter(filter: StoreFilter): void {
      this.value.value[filter.name] = filter;
   },
   get_all_filter_name(): string[] {
      return Object.keys(this.value.value);
   },
   delete_filter(name: string): void {
      delete this.value.value[name];
      this.value.save();
   }
}