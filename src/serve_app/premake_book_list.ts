

/// 预制的单词书
/// 内容取之以下网站:
/// https://github.com/busiyiworld/maimemo-export/tree/main/libraries/txt

import { Store } from "@tauri-apps/plugin-store";


const path_word_book_lists = "/public/word_book_lists/txt"

/// 允许展示的预制的单词书
export const allow_premake_book_name :string[] = [
   "小学英语大纲词汇",
   "初中英语大纲词汇",
   "高中英语词汇正序版",
   "四级新大纲词汇表",
   "四级高频词汇2000",
   "六级新大纲词汇表",
   "六级核心高频词汇突破",
   "考研英语大纲词汇5500",
   "考研英语词汇大全",
   "考研英语极简刷词手册"
];

/// 所有预制的单词书的名字
export const all_premake_book_names= Object.keys(import.meta.glob("../../public/word_book_lists/txt/*.txt"))
   .map(v=>v.replace("../../public/word_book_lists/txt/","").replace(".txt", ""));


/// 获取一本单词书的 txt 格式字符串
/// name : 单词书名
export const get_premake_book_txt = (name:string):Promise<string> =>{
   return new Promise((resolve, reject) =>{
      fetch(path_word_book_lists+"/"+name+".txt").then(v=>{
         v.text().then(v=>{
            resolve(v);
         })
      })
   })

}



