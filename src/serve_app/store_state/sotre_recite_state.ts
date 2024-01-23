import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";
import { BookWordMes } from "../word";
import { TranslateType, translate } from "../translation";
import { StoreFilter, filters_word_list } from "../filter";
import { Result, ok } from "../../tool/result";
import { Option, none, some } from "../../tool/option";
import { store_book_data } from "../sotre_data/sotre_book_data";
import { store_filter } from "../sotre_data/sotre_filter";
import { get_random_int } from "../../tool/random";
import { todo } from "../../tool/auxiliary_fn";
import { debug_time } from "../../tool/debug";
import { store_translation_buffer } from "../sotre_data/store_translation_buffer";

const default_key = StoreFile.StateRecite;
const store = new Store(StoreFile.StateRecite);

export type StateRecite = {
   book_name: Option<string>,//当前背诵的单词本
   filters: string[],//选择的过滤器
   // todo : 改成 word_list:string[]
   // ! : 现在应该避免使用 非 BookWordMes.word 中的其他属性 ,因为存在 存储数据和存储状态不同步 的隐患
   word_list: BookWordMes[],// 从 book_name 中通过filters后的word_list
   index: number,//当前背诵到的下标
   // random_mode:boolean,//是否是随机模式,
}

const default_recite_state = (): StateRecite => {
   return {
      book_name: none(),
      filters: [],
      word_list: [],
      index: 0,
   }
}

/// 存储实体 - 状态
/// 当前复习的进度
export const store_recite_state: {
   value: StoreValue<StateRecite>,
   /// 翻译存储
   // translation_map: { [word: string]: TranslateType },
   /// 翻译到的下标 
   index_translation: number,
   /// 重新加载value,全部状态初始化
   over_load(book_name: string, filters: StoreFilter[]): void,
   /// 加载,不初始化,继续使用之前的状态
   load(): void,
   /// 获取当前下标的单词,用于初始化获取单词
   get_current_word(): Option<BookWordMes>,
   /// None:表示没有下一个单词啦~ 
   next_word(): Option<BookWordMes>,
   /// 加载翻译,num:加载num个翻译
   load_translation_map(num: number): void,
   /// 获取翻译, none表示翻译未加载完成(map里还没有当前单词的翻译)
   get_translation(word_name: string): Option<TranslateType>,
} = {
   value: new StoreValue(store, default_key, default_recite_state,false,false),
   // translation_map: {},
   index_translation: 0,
   over_load(book_name: string, filters: StoreFilter[]): void {
      const recite_state: StateRecite = {
         book_name: some(book_name),
         filters: filters.map(v => v.name),
         word_list: Object.values(store_book_data.get_book(book_name).get_all_word_mes()),
         index: 0,
      };
      this.index_translation = 0;
      // this.translation_map = {};
      this.value.value = recite_state;
      // 过滤
      this.value.value.word_list = filters_word_list(this.value.value.filters.map(v => store_filter.get_filter(v).unwrap()
      ), this.value.value.word_list);
      // 过滤后,随机打乱
      this.value.value.word_list = this.value.value.word_list.sort((a, b) => (get_random_int(0, 1) ? -1 : 1));
      this.load_translation_map(15); //加载15个翻译结果
   },
   load(): void {
      // 同步翻译下标
      this.index_translation = this.value.value.index;
      this.load_translation_map(15); //加载15个翻译结果
   },
   get_current_word(): Option<BookWordMes> {
      const len = this.value.value.word_list.length;
      const index = this.value.value.index;
      if (index == len) {// 当前index已经是word_list的上限
         return none()
      }
      this.index_translation = index;
      this.load_translation_map(15);
      const word = this.value.value.word_list[index];
      return some(word);
   },
   next_word(): Option<BookWordMes> {
      const len = this.value.value.word_list.length;
      const index = this.value.value.index;
      if (index + 1 >= len) { // 当前index已经是word_list的上限,无法获取下一个
         this.value.value.index++;
         return none();
      }
      if (this.index_translation < index + 1) { //防止内存刷新(软件重新加载),导致this.index_translation==0
         this.index_translation = index + 1;
      }
      if (this.index_translation <= index + 10 + 1) { //提前10个 触发翻译
         this.load_translation_map(15); //加载15个翻译结果
      }
      this.value.value.index++;
      const word = this.value.value.word_list[index + 1];
      return some(word)
   },
   load_translation_map(num: number): void {
      const len = this.value.value.word_list.length;
      Array.from({ length: num }, (_, index) => index) //加载num个翻译结果
         .forEach(_ => {
            if (this.index_translation == len) return; ///翻译以到上限,停止后面的执行
            const word = this.value.value.word_list[this.index_translation].word;
            this.index_translation++;
            store_translation_buffer.updata(word);
         });
   },
   get_translation(word_name: string): Option<TranslateType> {
      return store_translation_buffer.get_translation(word_name);
   },

}


