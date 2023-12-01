import { Store } from "@tauri-apps/plugin-store";


/// 统一使用一个存储点
export const store:Store = new Store("store");


/// 存储的key,用于分区
/// 子区采用 : 冒号分割,例如 book:easy_word
export enum StoreKey {
   Setting = "setting",
   State = "state",
   Book = "book",
} 


/// 创建一个key
export const creat_key=(key:string[]):string=>{
   key.forEach((s,i)=>key[i]=s.replace(/:/g, ''));//移除不应该出现的':'
   return key.join(":").toString();
}

/// 提取存储中的所有数据,并且以 分区的形式 返回一个 对象(对象多变,所以any)
// const _ = async ():Promise<any> =>{
//    const a = await store.entries<any>();
//    for(const v in  a) {
//       const s = v.split(":");

//    }
// }

