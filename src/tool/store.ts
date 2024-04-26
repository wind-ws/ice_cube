import { Store } from "@tauri-apps/plugin-store";
import { panic, todo } from "./auxiliary_fn";
import { createSharedComposable, useStorage } from "solidjs-use";
import { createSignal } from "solid-js";
import { SetStoreFunction, createStore, produce } from "solid-js/store";
import { useDebounceFn } from 'solidjs-use'


/// 所有的存储文件
/// 每一个枚举是一个存储点,一个独立的仓库,也是文件名,也是key
/// 未来数据结构变得, 旧数据更新到新数据,可以直接新建一个 key 
///   例如 旧数据 BookData = "book_data.json" 到新数据 BookData2 = "book_data_2.json"
///   在做一个 结构转译 和 扫描旧版本数据 即可
export enum StoreFile {
   BookData = "book_data.json", //存储每个单词本的数据
   BookGolbal = "book_golbal.json", //存储所有单词共有的数据,不受单词本的影响
   Filter = "filter.json", //存储过滤器的数据
   // Time = "time.json", //存储耗时记录的数据
   Setting = "setting.json", //存储设置的数据
   // TranslationButter = "translation_butter.json", //翻译缓存存储的数据
   State = "state.json", //存储应用状态, 非数据
   History = "history.json", //记录一起历史记录
}


/**
 * todo : 自动检查 存储数据类型 和 当前数据类型 的差异 ,若有差异则进行变更导当前数据类型,进行存储更新(默认为初始值)
 */
export class StoreValue<V extends object> {
   private store: Store;
   private _store_id: StoreFile;
   get store_id() {
      return this._store_id
   }
   private _data: V;
   get data() {
      return this._data
   }
   //@ts-ignore
   private default_data: () => V;
   private share;
   /** 磁盘存储 尼阻去抖 */
   private _save_debounced_fn = useDebounceFn(
      () => {
         this.save();
      },
      200,//200ms 去抖
      { maxWait: 2000 } // 2s 强制触发
   );
   public static load_list: { [id: string]: boolean } = {};
   /** 存储资源是否加载完毕 ,true加载完毕*/
   public static is_load(): boolean {
      let b = true;
      Object.values(this.load_list).forEach(v => {
         b = b && v;
      })
      return b;
   }

   public static f() {

   }

   constructor(store_id: StoreFile, default_value: () => V) {
      StoreValue.load_list[store_id] = false;
      this._store_id = store_id;
      this.default_data = default_value;
      this.store = new Store(store_id);
      this._data = default_value();
      // this.delete_store();// 删除所有存储数据
      this.store.get<V>(this._store_id)
         .then(v => {
            if (v == null) {
               this.store.set(store_id, this._data);
            } else {
               this._data = v;
               this.share = createSharedComposable(() => {
                  const [get, set] = createStore(this._data);
                  return [get, set] as [get: V, set: SetStoreFunction<V>]
               })
            }
            StoreValue.load_list[store_id] = true;
         });
      this.share = createSharedComposable(() => {
         //不知道为什么, 刷新后,它不会为this.data套上代理(所以渲染不会同步到数据)
         //而再次热重载后,就套上代理了
         //应该是没事的,因为重启软件后,第一次是套上代理了
         const [get, set] = createStore(this._data);
         return [get, set] as [get: V, set: SetStoreFunction<V>]
      })
   }
   /** 返回一个可渲染同步this.data的玩意 */
   public render() {
      return this.share()
   }
   /**
    * !!! 不可在发布版本中使用!!!(这也只能在数据结构发生变化后,删除旧结构时使用)
    */
   private delete_store() {
      this.store.delete(this._store_id);
      this.save();
   }
   /**
    * 获得一个可渲染的东西,但它不会同步到this.data
    * #abolish
    */
   private get_render() {
      return createStore(this._data);
   }
   /** #abolish */
   private get(): V {
      return this._data;
   }
   /** #abolish */
   private set(value: V) {
      this._data = value;
      this.store.set(this._store_id, this._data);
   }

   /** 磁盘存储  */
   public save() {
      console.log(this._data);
      this.store.set(this._store_id, this._data);
      this.store.save();
   }
   /** 磁盘存储 尼阻去抖 */
   public save_debounced_fn() {
      this._save_debounced_fn();
   }

}

