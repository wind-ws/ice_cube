import { Store } from "@tauri-apps/plugin-store";
import { BookWordMes } from "../word";
import { StoreFile, StoreValue, creat_key } from "../store";


const default_key = StoreFile.BookData;
const child_key = (book_name: string): string => creat_key([default_key, book_name]);
const store = new Store(StoreFile.BookData);


/// 一本单词书的类型
/// 实际存储数据的单词书类型
/// 对应的key : book_data.json:<单词本名>
export type StoreBookData = {
   book_name: string, //书名
   word_list: {//单词列表
      [word: string]: BookWordMes
   }
}

export type WordList = StoreBookData["word_list"];


/// 单词书的默认值
const default_store_book_data = (name: string): StoreBookData => {
   return {
      book_name: name,
      word_list: {}
   }
}
/// 消除key的前缀book_data.json 获取后面的 单词本名
const get_name_from_key = (key: string): string => {
   return key.substring(creat_key([default_key]).length + 1)
}
/// 根据当前sotre存储 获取所有关于单词本数据的key 
export const get_book_keys = async (): Promise<string[]> => {
   return new Promise<string[]>((resolve, reject) => {
      store.keys()
         .then((v) => {
            /// 筛选出前缀是 "book_data.json:" 的key
            const keys = v.filter((key) => key.startsWith(default_key+":"))
            resolve(keys)
         })
         .catch(e => reject(e))
   })
}


const store_book_data :{
   value: { [book_name: string]: StoreValue<StoreBookData> }
} = {
   value:{},
}


