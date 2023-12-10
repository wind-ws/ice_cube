import { Store } from "@tauri-apps/plugin-store";
import { DeepObject, createDeepProxy } from "./proxy";
import { useRef, useState, useSyncExternalStore } from "react";



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
   public auto_set: boolean = false;//修改value是否自动存储到store,默认不自动存储
   public auto_save: boolean = false;//修改value是否自动存储到磁盘,默认不自动存储
   // private listeners: any = {};// #abolish
   public hook:[number,(v:number)=>void ]= [0,()=>{}];
   /// _default : 传入一个生成value的默认值 , 如果key在sotre中不存在才会使用默认值
   /// 不知道为什么Ts的类型推断不能用V约束存在Default来达到通过V泛型调用default函数
   constructor(key: string, _default: Default<V>, auto_set: boolean = false, auto_save: boolean = false) {
      this._key = key;
      this._value = createDeepProxy(_default(), (v) => this.ChangeHandler(v));
      store.get<V>(key).then(v => {
         if (!v) {//值不存在,初始化sotre
            store.set(key, this._value);
         } else {
            this._value = createDeepProxy(v, (v) => this.ChangeHandler(v));
         }
      });
      this.auto_set = auto_set;
      this.auto_save = auto_save;
   }
   get key(): string { return this._key }
   get value(): DeepObject<V> { return this._value }
   set value(v: V) {
      this._value = createDeepProxy(v, (v) => this.ChangeHandler(v));
      if (this.auto_set) {
         store.set(this._key, this._value);
      }
      if (this.auto_save) {
         this.save();
      }
   }
   /// ! 注意 : 如果你没有调用这个函数,你 所有的修改都不会被保存到store(如果调用正确的store.set会保存到sotre)
   public save() {
      store.set(this._key, this._value);
      store.save();//! 注意 : save会存储所有的key
   }
   /// 现在已经通过Proxy达到存储和变量同步, 这个函数要完成的是 变量和渲染同步
   /// 只需要把 useState(0) 传进来就可以在当前页面 同步渲染了
   /// 不要 用子组件的状态, 不然 父组件就不会渲染了
   /// 经量少用这个
   public set_hook(hook:[number,(v:number)=>void ]){
      this.hook = hook;
   }
   /// 值被修改后触发
   private ChangeHandler(updatedObject: DeepObject<V>) {
      console.log(`被修改的key<${this._key}>,被修改的内容如下`);
      console.log(updatedObject);
      this.hook[1](this.hook[0]+1);// 若触发这个hook会触发渲染吗?
      if (this.auto_set) {
         store.set(this._key, this._value);
      }
      if (this.auto_save) {
         this.save();
      }
   }



}


