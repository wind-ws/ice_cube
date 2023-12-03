import { Toast } from "antd-mobile"
import { StoreKey, StoreValue, creat_key, store } from "../store"
import { BookWordMes, GlobalWordMes, default_golbal_word_mes } from "../word"
import { useRef } from "react"


/// 子分区
enum SotreBookKey {
   BookMes = "book_mes", //所有单词本的信息
   Golbal = "golbal", //存储单词的全局信息
   Data = "data",// 这个key是"book:data:<单词本名>",存储实际的单词本数据
}

export namespace book_data {
   /// 一本单词书的类型
   /// 实际存储数据的单词书类型
   /// 对应的key : book:data:<单词本名>
   export type StoreBookData = {
      book_name: string, //书名
      word_list: {//单词列表
         [word: string]: BookWordMes
      }
   }
   /// 通过name 获得 正确的key
   export const book_key = (name: string): string => {
      return creat_key([StoreKey.Book, SotreBookKey.Data, name]);
   }
   /// 消除key的前缀book:data 获取后面的 单词本名
   export const get_name_from_key = (key: string): string => {
      return key.substring(creat_key([StoreKey.Book, SotreBookKey.Data]).length + 1)
   }
   /// 获取所有单词本的key
   export const get_book_keys = async (): Promise<string[]> => {
      return new Promise<string[]>((resolve, reject) => {
         store.keys()
            .then((v) => {
               /// 筛选出前缀是 book:data 的key
               const keys = v.filter((key) => key.startsWith(creat_key([StoreKey.Book, SotreBookKey.Data])))
               resolve(keys)
            })
            .catch(e => reject(e))
      })
   }
   /// 通过key 获取一本单词书的实际存储数据
   export const get_book = async (key: string): Promise<StoreBookData|null> => {
      return new Promise<StoreBookData|null>((resolve, reject) => {
         store.get<StoreBookData>(key)
            .then(book => resolve(book))
            .catch(e=>reject(e))
      })
   }

   /// 创建一本单词书
   export const creat_book = (name: string) => {
      //检查没有重复的书名
      const key = book_key(name);
      store.has(key).then(v => {
         if (v) {//重复
            Toast.show("名字重复");
         } else {//不重复
            store.set(key, <StoreBookData>{
               book_name: name,
               word_list: {}
            });
         }
      })

   }

   /// 删除一本单词数
   export const delete_book = (name: string) => {
      const key = book_key(name);
      store.delete(key)
         .then(v => {
            //删除成功
         })
   }
   /// 所有单词数的实体状态
   export const store_books:{
      value:{[book_name:string]:StoreValue<StoreBookData>}
   } = {
      value:{},
      
   }
}

export namespace book_golbal {

   export const golbal_key = (): string => {
      return creat_key([StoreKey.Book, SotreBookKey.Golbal]);
   }

   /// 对应的key : book:golbal
   type StoreGolbal = {
      [word: string]: GlobalWordMes
   }


   /// store_golbal 的实体状态
   export const store_golbal: {
      value: StoreValue<StoreGolbal>,//存储状态的值
      set_note: (word: string, note: string) => void, // 修改note
      set_star: (word: string, star: boolean) => void,// 修改star
   } = {
      value: new StoreValue<StoreGolbal>(golbal_key(),()=>{return{}}),
      set_note: (word: string, note: string) => {
         maybe_init(word);
         store_golbal.value.value[word].note = note;
      },
      set_star: (word: string, star: boolean) => {
         maybe_init(word);
         store_golbal.value.value[word].star = star;
      }
   };

   /// wrod若不存在则初始化
   const maybe_init = (word: string) => {
      if (!store_golbal.value.value[word]) {//若不存在则初始化
         store_golbal.value.value[word] = default_golbal_word_mes(word);
      }
   }


}


