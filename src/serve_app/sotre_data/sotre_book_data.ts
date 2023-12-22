import { Store } from "@tauri-apps/plugin-store";
import { BookWordMes } from "../word";
import { StoreFile, creat_key } from "../store";


const key = creat_key(["book_data"]);
const book_key = (book_name: string):string => creat_key([key, book_name]);
const sotre = new Store(StoreFile.BookData);


/// 一本单词书的类型
/// 实际存储数据的单词书类型
/// 对应的key : book:data:<单词本名>
export type StoreBookData = {
   book_name: string, //书名
   word_list: {//单词列表
      [word: string]: BookWordMes
   }
}

export type WordList = StoreBookData["word_list"];


