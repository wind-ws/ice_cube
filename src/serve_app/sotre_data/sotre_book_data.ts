import { Store } from "@tauri-apps/plugin-store";
import { BookWordMes, set_first_time } from "../word";
import { StoreFile, StoreValue, creat_key } from "../store";
import { Option, some } from "../../tool/option";
import { Result, err, ok } from "../../tool/result";
import { store_word_golbal } from "./store_word_golbal";
import { panic } from "../../tool/auxiliary_fn";


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
/// 通过name 获得 正确的key
const get_key_from_name = (book_name: string): string => {
   return child_key(book_name);
}
/// 消除key的前缀book_data.json 获取后面的 单词本名
const get_name_from_key = (key: string): string => {
   return key.substring(creat_key([default_key]).length + 1)
}
/// 根据当前sotre存储 获取所有关于单词本数据的key 
const get_book_keys = async (): Promise<string[]> => {
   return new Promise<string[]>((resolve, reject) => {
      store.keys()
         .then((v) => {
            /// 筛选出前缀是 "book_data.json:" 的key
            const keys = v.filter((key) => key.startsWith(default_key + ":"))
            resolve(keys)
         })
         .catch(e => reject(e))
   })
}

const new_StoreValue = (book_name: string, key: string) => {
   return new StoreValue<StoreBookData>(store, key,
      () => default_store_book_data(book_name), false, false);
}

/// 存储实体
/// 所有单词本的数据
export const store_book_data: {
   value: { [book_name: string]: StoreValue<StoreBookData> },
   /// 获取所有书名
   get_all_book_name(): string[],
   /// 获取所有单词本的key 根据当前变量store_book_data.value
   get_all_key(): string[],
   /// 创建一本单词书
   /// true:创建成功, false: 重复key,创建失败
   creat_book(book_name: string): Promise<boolean>,
   /// 删除一本单词本
   delete_book(book_name: string): Promise<void>,
   /// 获取一本单词书的实际操作
   get_book(book_name: string): {
      /// 把单词推进指定的单词本, is_replace=true 若以存在则替换
      put_word(word: BookWordMes, is_replace: boolean): void,
      /// 把 大量单词 推进指定的单词本, is_replace=true 若以存在则替换
      put_word_list(word_list: WordList, is_replace: boolean): void,
      /// 获取所有单词信息,并非复制而是引用
      get_all_word_mes(): WordList,
      /// 删除指定的单词本中的单词
      delete_word(word: string): void,
      /// 删除指定单词本的所有单词
      delete_all_word(): void,
      /// 设置一本单词书中一个单词的last_time
      set_word_time(word: string, time: number): void,
      /// 设置一本单词书中一个单词的score
      set_word_score(word: string, score: number): void,
      /// 设置一本单词书中一个单词的first_time
      set_word_first_time(word: string): void,
      /// 对一个单词本的单词的yes 加1
      plus_word_yes(word: string): void,
      /// 对一个单词本的单词的no 加1
      plus_word_no(word: string): void,
      /// 调用StoreValue中的save
      save(): void,
      /// 获得单词的数量
      len(): number,
      /// 获得单词被star的数量(true的数量)
      star_len(): number,
      /// 获得当前单词的所有信息
      get_mes(word: string): BookWordMes,
   },
} = {
   value: (() => {//加载所有已经存在的单词本
      get_book_keys().then((keys) => {
         keys.forEach(key => {
            const book_name = get_name_from_key(key);
            store_book_data.value[book_name] = new_StoreValue(book_name, key);
         })
      })
      return {}
   })(),
   get_all_book_name(): string[] {
      return Object.keys(store_book_data.value)
   },
   get_all_key(): string[] {
      return this.get_all_book_name().map(v => get_key_from_name(v))
   },
   creat_book(book_name: string): Promise<boolean> {
      const key = get_key_from_name(book_name);
      return new Promise((resolve, reject) => {
         store.has(key).then(v => {
            if (v) {//重复
               resolve(false)
            } else {//不重复
               store_book_data.value[book_name] = new_StoreValue(book_name, key);
               store.save()
               resolve(true)
            }
         }).catch(e => reject(e));
      })
   },
   delete_book(book_name: string): Promise<void> {
      return new Promise((resolve, reject) => {
         const key = get_key_from_name(book_name);
         store.delete(key)
            .then(v => {//删除成功
               delete store_book_data.value[book_name];
               resolve();
            }).catch(e => { resolve() })
         store.save()
      })
   },
   get_book(book_name: string) {
      const book = store_book_data.value[book_name];
      return {
         book: book,
         put_word(word: BookWordMes, is_replace: boolean): void {
            if (book.value.word_list[word.word] === undefined) {//不存在
               book.value.word_list[word.word] = word
            } else if (is_replace) {//存在,嘿嘿,但是可以替换
               book.value.word_list[word.word] = word
            }
         },
         put_word_list(word_list: WordList, is_replace: boolean): void {
            book.auto_set_off();//导入大量单词时关闭自动插入
            Object.values(word_list).forEach(word => this.put_word(word, is_replace));
            book.auto_set_default();
            this.save();
         },
         get_all_word_mes(): WordList {
            return book.value_unproxy.word_list
         },
         delete_word(word: string): void {
            delete book.value.word_list[word];
         },
         delete_all_word(): void {
            book.value.word_list = {};
         },
         set_word_time(word: string, time: number): void {
            book.value.word_list[word].last_time = time;
         },
         set_word_score(word: string, score: number): void {
            book.value.word_list[word].score = score;
         },
         set_word_first_time(word: string): void {
            book.value.word_list[word] = set_first_time(book.value.word_list[word])
         },
         plus_word_yes(word: string): void {
            book.value.word_list[word].yes = book.value_unproxy.word_list[word].yes + 1;
         },
         plus_word_no(word: string): void {
            book.value.word_list[word].no = book.value_unproxy.word_list[word].no + 1;
         },
         save(): void {
            book.save();
         },
         len(): number {
            return Object.keys(book.value.word_list).length;
         },
         star_len(): number {
            store_word_golbal.value.auto_set_off();
            const len = Object.keys(book.value.word_list)
               // .map(word => store_word_golbal.get_star(word))//这个会导致性能问题, 重复且大量的触发 proxy 
               .map(word => store_word_golbal.value.value_unproxy[word]!=undefined 
                  && store_word_golbal.value.value_unproxy[word].star)
               .filter(v => v).length;
            store_word_golbal.value.auto_set_default();
            // store_word_golbal.value.save();
            return len;
         },
         get_mes(word: string): BookWordMes {
            return book.value.word_list[word]
         }

      }
   }

}


