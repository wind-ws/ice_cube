import { StoreKey, creat_key, store } from "../store"


/// 子分区
enum SotreBookKey {
   BookMes="book_mes", //所有单词本的信息
   Data="data",// 这个key是"book:data:<单词本名>",存储实际的单词本数据
}

/// 一本单词书的类型
/// 实际存储数据的单词书类型
export type Book = {
   book_name:string, //书名
   word_list:{//单词列表
      [word:string]:BookWordMes
   }
}

const book_key = (name:string):string=>{
   return creat_key([StoreKey.Book,SotreBookKey.Data,name]);
}

/// 返回所有单词本信息
const book_entries = ():Book[]=>{
   
   return []
}

/// 创建一本单词书
const creat_book = (name:string)=>{
   //检查没有重复的书名
   const key = book_key(name);
   store.has(key).then(v=>{
      if(v){//重复

      }else{//不重复

      }
   })

}

/// 删除一本单词数
const delete_book = (name:string)=>{
   const key = book_key(name);
   store.delete(key)
   .then(v=>{
      //删除成功
   })
}



