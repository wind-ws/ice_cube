


/// 格式: 
/// 一行一个单词,<note>允许换行,note和word中不允许出现'|'符号
/// <word>
/// <word>|<note>|
/// <word>|
///   <note>
/// |

import { WordList } from "./sotre_data/sotre_book_data";
import { store_word_golbal } from "./sotre_data/store_word_golbal";
import { default_book_word_mes } from "./word";


/// 处理多于的空格
/// example: "  ab     c ef " => "ab c ef"
const trim_spaces = (str: string): string =>{
   return str.trim().replace(/\s+/g, ' ')
}


/// 解析
export const parse = (str: string):WordList=>{
   // 这个正则表达式有点问题, 如果最后一个单词后面没有换行符,那就无法匹配(对于<word>,而非<word>|<note>|)
   // 所以这里在后面加一个
   str = str + "\n";
   //                匹配<word>                 |  匹配<word>|<note>|
   const regex = /([\u4e00-\u9fa5a-zA-Z \d]+?\n|[\u4e00-\u9fa5a-zA-Z \d]+\|[\u4e00-\u9fa5a-zA-Z\s\d]*\|\n?)/g;
   const matches = str.match(regex);
   const word_list:WordList = {};
   matches?.forEach(v=>{
      if(v.includes("|")){ // <word>|<note>| 型
         const regex = /([\u4e00-\u9fa5a-zA-Z \d]+)\|([\u4e00-\u9fa5a-zA-Z\s\d]*)\|\n?/;
         const matches = v.match(regex);
         if(matches){
            // 把note处理进store , note会直接掩盖之前的note
            const word = trim_spaces(matches[1]);
            word_list[word]=default_book_word_mes(word);
            const note = matches[2];
            store_word_golbal.set_note(word,note);
         }
      }else {// <word>型
         const word = trim_spaces(v);
         word_list[word]=default_book_word_mes(word);
      }
   })
   delete word_list[""];//删除空的
   return word_list;
}


