import { Store } from "@tauri-apps/plugin-store";
import { createDeepProxy } from "../tool/proxy";
import { useRef, useState, useSyncExternalStore } from "react";



/// 所有的存储文件
/// 每一个枚举是一个存储点,一个独立的仓库,也是文件名
/// 对于当前的仓库,默认的key,就是枚举本身, 若要分区,就是 "枚举本身:子区key"
/// 这样的设计是确保即使不在同一个存储点里,key任然是全局独一无二的
/// 例如: 
///   StoreFile.BookData ,默认的key的操作 sotre.set("book_data.json",{})
///   子区: store.set("book_data.json:abc",{})
/// 要求每一个ts文件(可以包含子文件夹)管理一个存储文件
/// 命名规定(对于每个独立的存储点):
///   const default_key //就是枚举本身
///   const child_key   //子区的key,可以是函数生成
///   const store       //仓库的实体
export enum StoreFile {
   BookData = "book_data.json", //存储每个单词本的数据
   BookGolbal = "book_golbal.json", //存储所有单词共有的数据,不受单词本的影响
   Filter = "filter.json", //存储过滤器的数据
   Time = "time.json", //存储耗时记录的数据
   Setting = "setting.json", //存储设置的数据
   TranslationButter = "translation_butter.json", //翻译缓存存储的数据
   StateRecite = "state_recite.json", //存储背诵的状态

}


/// 创建一个key
export const creat_key = (key: string[]): string => {
   key.forEach((s, i) => key[i] = s.replace(/:/g, ''));//移除不应该出现的':'
   return key.join(":").toString();
}

/// 返回一个默认值
type Default<T> = () => T;



export class StoreValue<V extends object> {
   private _store: Store;
   private _key: string;//它的key
   private _value: V;//sotre中实际存储的值 , 所有set使用它
   private _value_unproxy: V;// 不被proxy的存储值,所有get使用它,
   private auto_set: boolean;//修改value是否自动存储到store,默认自动存储
   private auto_save: boolean;//修改value是否自动存储到磁盘,默认不自动存储
   private auto_log: boolean;//修改value是否自动输出log,默认自动输出log
   private auto_init: {// 所有auto的初始值, 通过构造函数的初始值,构造后这个值不可修改
      readonly auto_set: boolean,
      readonly auto_save: boolean,
      readonly auto_log: boolean
   }
   private _cycle_time_save: number = 0;// 0 表示不执行周期自动存储
   private _cycle_time_id;
   // app的所有key都在这里,且它是用来判断 所有的文件是否已经加载到内存,是否已经加载到当前的_value里
   // key:true 就是当前key加载完成, key:false 就是当前key没有加载完成
   public static load_progress: { [key: string]: boolean } = {};

   /// true : 全部key加载完成, false : 有部分key没有加载完成
   public static is_load(): boolean {
      const arr = Object.values(StoreValue.load_progress);
      if (arr.length == 0) {//这说明连nm一个构造函数都没有开始运行
         return false;
      }
      return !arr.some(v => v === false)
   }

   constructor(store: Store, key: string, _default: Default<V>,
      auto_set: boolean = true, auto_save: boolean = false, auto_log: boolean = true,
      cycle_time_save: number = 0) {
      StoreValue.load_progress[key] = false;//开始加载
      this._store = store;
      this._key = key;
      this.auto_set = auto_set;
      this.auto_save = auto_save;
      this.auto_log = auto_log;
      this.auto_init = {
         auto_set,
         auto_save,
         auto_log
      }
      if (cycle_time_save != 0) {
         this._cycle_time_id = setInterval(() => {
            this.save();
         }, cycle_time_save);
      }
      this._value_unproxy = _default();
      this._value = createDeepProxy(this._value_unproxy, (v) => this.ChangeHandler(v));
      this._store.get<V>(key).then(v => {//自动加载
         if (!v) {//值不存在,初始化sotre
            store.set(key, this._value_unproxy);
         } else {
            this._value = createDeepProxy(v, (v) => this.ChangeHandler(v));//利用它去初始化Option和Result
            this._value_unproxy = {...this._value};
            this._value = createDeepProxy(this._value_unproxy, (v) => this.ChangeHandler(v));
         }
         StoreValue.load_progress[key] = true;//加载完成
      });
   }

   get key(): string { return this._key }
   get value_unproxy(): V { return this._value_unproxy }
   // get unsafe_value_unproxy(): V { return this._value_unproxy }
   /// ! 注意 : 修改 unsafe_value_unproxy 不会触发proxy 
   // set unsafe_value_unproxy(v: V){}
   get value(): V { return this._value }
   set value(v: V) {
      this._value_unproxy = v;
      this._value = createDeepProxy(this._value_unproxy, (v) => this.ChangeHandler(v));
      if (this.auto_log) {
         console.log(`此key<${this._key}>整体内容完全被修改,修改内容如下:`);
         console.log(v);
      }
      if (this.auto_set) {
         this._store.set(this._key, this._value_unproxy);
      }
      if (this.auto_save) {
         this.save();
      }
   }
   public save() {
      this._store.set(this._key, this._value_unproxy);
      this._store.save();
   }
   private ChangeHandler(updatedObject: V) {
      if (this.auto_log) {
         console.warn(`此key<${this._key}>内容被修改,修改内容如下:`);
         console.warn(updatedObject);
      }
      if (this.auto_set) {
         this._store.set(this._key, this._value_unproxy);
      }
      if (this.auto_save) {
         this.save();
      }
   }

   public auto_set_on() {
      this.auto_set = true;
   }
   public auto_set_off() {
      this.auto_set = false;
   }
   public auto_set_default() {
      this.auto_set = this.auto_init.auto_set;
   }
   public auto_log_on() {
      this.auto_log = true;
   }
   public auto_log_off() {
      this.auto_log = false;
   }
   public auto_log_default() {
      this.auto_log = this.auto_init.auto_log;
   }
   public auto_save_on() {
      this.auto_save = true;
   }
   public auto_save_off() {
      this.auto_save = false;
   }
   public auto_save_default() {
      this.auto_save = this.auto_init.auto_save;
   }

}

