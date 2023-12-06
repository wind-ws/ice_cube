import { Toast } from "antd-mobile"
import { StoreKey, StoreValue, creat_key, store } from "../store"
import { BookWordMes, GlobalWordMes, default_golbal_word_mes } from "../word"


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
   
   export type WordList = book_data.StoreBookData["word_list"];

   const default_store_book_data=(name: string):StoreBookData=>{
      return {
         book_name:name,
         word_list:{}
      }
   }
   /// 通过name 获得 正确的key
   export const make_book_key = (name: string): string => {
      return creat_key([StoreKey.Book, SotreBookKey.Data, name]);
   }
   /// 消除key的前缀book:data 获取后面的 单词本名
   export const get_name_from_key = (key: string): string => {
      return key.substring(creat_key([StoreKey.Book, SotreBookKey.Data]).length + 1)
   }
   /// 获取所有单词本的key 根据当前sotre存储
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
   /// #abolish
   export const get_book = async (key: string): Promise<StoreBookData | null> => {
      return new Promise<StoreBookData | null>((resolve, reject) => {
         store.get<StoreBookData>(key)
            .then(book => resolve(book))
            .catch(e => reject(e))
      })
   }


   /// 所有单词书的实体状态
   export const store_books: {
      value: { [book_name: string]: StoreValue<StoreBookData> },
      // add_value:(name: string)=>void,// 给 value 添加一个book
      creat_book:(name: string)=>void,// 创建一个单词数
      delete_book:(name: string)=>void,// 删除一本单词数
      // get_book:(name: string)=>StoreValue<StoreBookData>,// 获取一本单词书的数据
      get_all_book_name():string[],//获取所有书名
      get_all_key():string[],//获取所有单词本的key 根据当前变量store_books.value
      put_word(name:string, word:BookWordMes,is_replace:boolean):void,// 把单词推进指定的单词本, is_replace 若以存在是否替换
      put_word_list(name:string, word_list:WordList,is_replace:boolean):void,//把 大量单词 推进指定的单词本, is_replace 若以存在是否替换
      get_all_word_mes(name: string):WordList,//获取所有单词信息
   } = {
      value: (()=>{//加载所有已经存在的单词本
         (async ()=>{
            const keys = await get_book_keys();
            keys.forEach(key => {
               const name = get_name_from_key(key);
               store_books.value[name] = new StoreValue<StoreBookData>(key,
                  ()=>default_store_book_data(name));
            })
         })()
         return {}
      })(),
      creat_book(name:string){
         const key = make_book_key(name);
         store.has(key).then(v => {
            if (v) {//重复
               Toast.show("名字重复");
            } else {//不重复
               store_books.value[name] = new StoreValue<StoreBookData>(key,
                  ()=>default_store_book_data(name));
               store.save()
               Toast.show("创建成功");
            }
         })
      },
      delete_book(name: string){
         const key = make_book_key(name);
         store.delete(key)
            .then(v => {//删除成功
               delete store_books.value[name];
            })
      },
      get_all_book_name():string[]{
         return Object.keys(store_books.value) 
      },
      get_all_key():string[]{
         return this.get_all_book_name().map(v=>make_book_key(v))
      },
      put_word(name:string, word:BookWordMes,is_replace:boolean){
         // 虽然可以只写一个if,但是可读性更加重要
         if(this.value[name].value.word_list[word.word]==undefined){//不存在
            this.value[name].value.word_list[word.word]=word
         }else if(is_replace){//存在,嘿嘿,但是可以替换
            this.value[name].value.word_list[word.word]=word
         }
      },
      put_word_list(name:string, word_list:WordList,is_replace:boolean){
         Object.values(word_list).forEach(word=>this.put_word(name,word,is_replace))
      },
      get_all_word_mes(name:string):WordList{
         return this.value[name].value.word_list
      }
   }
}

export namespace book_golbal {

   export const golbal_key = creat_key([StoreKey.Book, SotreBookKey.Golbal])

   /// 对应的key : book:golbal
   type StoreGolbal = {
      [word: string]: GlobalWordMes
   }


   /// store_golbal 的实体状态
   export const store_golbal: {
      value: StoreValue<StoreGolbal>,//存储状态的值
      set_note: (word: string, note: string) => void, // 修改note
      set_star: (word: string, star: boolean) => void,// 修改star
      get_star(word: string): boolean,//获取单词是否是star, 单词不存在就返回flase
      get_note(word: string): string,//获得单词的note , 单词不存在则返回 ""
   } = {
      value: new StoreValue<StoreGolbal>(golbal_key, () => ({})),
      set_note: (word: string, note: string) => {
         maybe_init(word);
         store_golbal.value.value[word].note = note;
      },
      set_star: (word: string, star: boolean) => {
         maybe_init(word);
         store_golbal.value.value[word].star = star;
      },
      get_star(word:string):boolean {
         if(store_golbal.value.value[word]){//存在
            return store_golbal.value.value[word].star
         } else {//不存在
            return false
         }
         
      },
      get_note(word: string): string{
         if(store_golbal.value.value[word]){//存在
            return store_golbal.value.value[word].note
         } else {//不存在
            return ""
         }
      }
   };

   /// wrod若不存在则初始化
   const maybe_init = (word: string) => {
      if (!store_golbal.value.value[word]) {//若不存在则初始化
         store_golbal.value.value[word] = default_golbal_word_mes(word);
      }
   }


}


