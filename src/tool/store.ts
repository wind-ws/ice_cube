import { Store } from "@tauri-apps/plugin-store";


/// 统一使用一个存储点
export const store: Store = new Store("store");


/// 存储的key,用于分区
/// 子区采用 : 冒号分割,例如 book:easy_word
export enum StoreKey {
   Setting = "setting",
   State = "state",
   Book = "book",
}


/// 创建一个key
export const creat_key = (key: string[]): string => {
   key.forEach((s, i) => key[i] = s.replace(/:/g, ''));//移除不应该出现的':'
   return key.join(":").toString();
}

/// 返回一个默认值
type Default<T> = ()=> T;


/// 一个对应key存储的value
export class StoreValue<V> {
   private _key: string;//它的key
   private _value: V;//sotre中实际存储的值
   public auto_save: boolean = false;//修改value是否自动存储,默认不自动存储
   /// _default : 传入一个生成value的默认值
   /// 不知道为什么Ts的类型推断不能用V约束存在Default来达到通过V泛型调用default函数
   constructor(key: string,_default:Default<V>, auto_save?: boolean) {
      this._key = key;
      this._value = _default();
      store.get<V>(key).then(v => {
         if (!v) {//值不存在,初始化sotre
            store.set(key,this._value);
         }else{
            this._value = v;
         }
      });
      if (auto_save != undefined) this.auto_save = auto_save;
   }
   get key(): string { return this._key }
   get value(): V { return this._value }
   set value(v: V) { 
      this._value = v;
      if(this.auto_save) {
         this.save();
      }
   }
   public save(){
      store.set(this._key,this._value);
      store.save();//! 注意 : save会存储所有的key
   }
}


