import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";
import { StoreFilter } from "../filter";


const default_key = StoreFile.Filter;
const store = new Store(StoreFile.Filter);



/// 存储实体
/// 存储所有过滤器数据
const store_filter : {
   value:StoreValue<{[name:string]:StoreFilter}>,
   get_filter(name:string):StoreFilter,//Option<StoreFilter>
   set_filter(filter:StoreFilter):void,
   get_all_filter_name():string[],
   delete_all_filter():void,//删除所有过滤器
} = {
   value: new StoreValue(store,default_key,()=>({}),true,true),
   get_filter(name: string): StoreFilter {
      return this.value.value[name] 
   },
   set_filter(filter: StoreFilter): void {
      this.value.value[filter.name] = filter;
   },
   get_all_filter_name(): string[] {
      return Object.keys(this.value.value)
   },
   delete_all_filter(): void {
      throw new Error("Function not implemented.");
   }
}