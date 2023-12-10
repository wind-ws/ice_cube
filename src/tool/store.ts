import { Store } from "@tauri-apps/plugin-store";
import { DeepObject, createDeepProxy } from "./proxy";


/// 统一使用一个存储点
export const store: Store = new Store("store");


/// 存储的key,用于分区
/// 子区采用 : 冒号分割,例如 book:easy_word
export enum StoreKey {
   Setting = "setting",
   State = "state",
   Book = "book",
   Filter = "filter",
}


/// 创建一个key
export const creat_key = (key: string[]): string => {
   key.forEach((s, i) => key[i] = s.replace(/:/g, ''));//移除不应该出现的':'
   return key.join(":").toString();
}

/// 返回一个默认值
type Default<T> = () => T;


/// 一个对应key存储的value
/// 这个包装类 可以 自动初始化存储,自动保存到磁盘
/// 这个 包装类 保证 修改值一定会执行 store.set ,存储进store里面,至于是否存储进磁盘,交给save函数 (频繁调用save并不好)
export class StoreValue<V extends object> {
   private _key: string;//它的key
   private _value: DeepObject<V>;//sotre中实际存储的值
   public auto_save: boolean = false;//修改value是否自动存储,默认不自动存储
   /// _default : 传入一个生成value的默认值 , 如果key在sotre中不存在才会使用默认值
   /// 不知道为什么Ts的类型推断不能用V约束存在Default来达到通过V泛型调用default函数
   constructor(key: string, _default: Default<V>, auto_save?: boolean) {
      this._key = key;
      this._value = createDeepProxy(_default(),this.ChangeHandler);
      store.get<V>(key).then(v => {
         if (!v) {//值不存在,初始化sotre
            store.set(key, this._value);
         } else {
            // this._value = createDeepProxy(v,this.ChangeHandler);
         }
      });
      if (auto_save != undefined) this.auto_save = auto_save;
   }
   get key(): string { return this._key }
   get value(): DeepObject<V> { return this._value }
   set value(v: V) {
      this._value = createDeepProxy(v,this.ChangeHandler);
      store.set(this._key, this._value);
      if (this.auto_save) {
         this.save();
      }
   }
   /// ! 注意 : 如果你没有调用这个函数,你 所有的修改都不会被保存到store(如果调用正确的store.set会保存到sotre)
   /// #abolish : 这个包装类具有修改值自动调用sotre.set的能力, save 直接调用 store.save()即可
   public save() {
      store.set(this._key, this._value);
      store.save();//! 注意 : save会存储所有的key
   }

   /// 值被修改后触发
   private ChangeHandler(updatedObject: DeepObject<V>){
      // console.log(`store<${this._key}>被修改,被修改的部分:`);
      console.log(updatedObject);
      // store.set(this._key, this._value);
      if (this.auto_save) {
         this.save();
      }
   }

}


