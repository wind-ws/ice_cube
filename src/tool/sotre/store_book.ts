import { StoreKey, creat_key, store } from "../store"
import { BookWordMes, GlobalWordMes, default_golbal_word_mes } from "../word"


/// 子分区
enum SotreBookKey {
   BookMes = "book_mes", //所有单词本的信息
   Golbal = "golbal", //存储单词的全局信息
   Data = "data",// 这个key是"book:data:<单词本名>",存储实际的单词本数据
}

export namespace book {
   /// 一本单词书的类型
   /// 实际存储数据的单词书类型
   /// 对应的key : book:data:<单词本名>
   export type StoreBookData = {
      book_name: string, //书名
      word_list: {//单词列表
         [word: string]: BookWordMes
      }
   }

   export const book_key = (name: string): string => {
      return creat_key([StoreKey.Book, SotreBookKey.Data, name]);
   }

   /// 返回所有单词本信息
   const book_entries = (): StoreBookData[] => {

      return []
   }

   /// 创建一本单词书
   const creat_book = (name: string) => {
      //检查没有重复的书名
      const key = book_key(name);
      store.has(key).then(v => {
         if (v) {//重复

         } else {//不重复
            store.set(key, <StoreBookData>{
               book_name: name,
               word_list: {}
            });
         }
      })

   }

   /// 删除一本单词数
   const delete_book = (name: string) => {
      const key = book_key(name);
      store.delete(key)
         .then(v => {
            //删除成功
         })
   }

}

export namespace golbal {

   export const golbal_key = (): string => {
      return creat_key([StoreKey.Book, SotreBookKey.Golbal]);
   }
   
   /// 对应的key : book:golbal
   type StoreGolbal= {
      [word:string]: GlobalWordMes
   }

   
   /// store_golbal 的实体状态
   export const store_golbal:{
      value:StoreGolbal,//存储状态的值
      set_note:(word:string,note:string) =>void, // 修改note
      set_star:(word:string,star:boolean) =>void,// 修改star
   } = {
      value:(():StoreGolbal=>{
         store.get<StoreGolbal>(golbal_key())
            .then(v=>{
                  if(v==null) {
                     store.set(golbal_key(),{});//初始化store
                  }else{
                     store_golbal.value=v;
                  }
               }
            )
         return {}
      })(),
      set_note:(word:string, note:string)=>{
         maybe_init(word);
         store_golbal.value[word].note = note;
      },
      set_star:(word:string,star:boolean)=>{
         maybe_init(word);
         store_golbal.value[word].star = star;
      }
   };

   /// wrod若不存在则初始化
   const maybe_init=(word:string)=>{
      if(!store_golbal.value[word]){//若不存在则初始化
         store_golbal.value[word]=default_golbal_word_mes(word);
      }
   }


}


