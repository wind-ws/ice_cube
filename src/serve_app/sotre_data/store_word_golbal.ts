import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";
import { GlobalWordMes, default_golbal_word_mes } from "../word"

const default_key = StoreFile.BookGolbal;
const store = new Store(StoreFile.BookGolbal);

/// 对应的key : book:golbal
/// 用于 跨单词本共享每个单词的数据(这数据不受单词本的限制)
type StoreWordGolbal = {
   [word: string]: GlobalWordMes
}

/// wrod若不存在则初始化
const maybe_init = (word: string) => {
   if (!store_word_golbal.value.value[word]) {//若不存在则初始化
      store_word_golbal.value.value[word] = default_golbal_word_mes(word);
   }
}

/// 存储实体
/// 单词的共有数据
const store_word_golbal: {
   value: StoreValue<StoreWordGolbal>,//存储状态的值
   /// 修改note
   set_note(word: string, note: string): void,
   /// 修改star
   set_star(word: string, star: boolean): void,
   /// 获取单词是否是star, 单词不存在就返回flase,并且初始化
   get_star(word: string): boolean,
   /// 获得单词的note , 单词不存在则返回 "",并且初始化
   get_note(word: string): string,
} = {
   value: new StoreValue(store, default_key, () => ({})),
   set_note(word: string, note: string): void {
      maybe_init(word);
      store_word_golbal.value.value[word].note = note;
   },
   set_star(word: string, star: boolean): void {
      maybe_init(word);
      store_word_golbal.value.value[word].star = star;
   },
   get_star(word: string): boolean {
      if(store_word_golbal.value.value[word]){//存在
         return store_word_golbal.value.value[word].star
      } else {//不存在 ,则初始化
         this.set_star(word,false);
         return false
      }
   },
   get_note(word: string): string {
      if(store_word_golbal.value.value[word]){//存在
         return store_word_golbal.value.value[word].note
      } else {//不存在
         this.set_note(word,"");
         return ""
      }
   }
}

