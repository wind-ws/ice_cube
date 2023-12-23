/// 背诵中的全局状态

import { StoreFilter, filters_word_list, store_filter } from "../filter"
import { get_random_int } from "../../tool/random"
import { book_data } from "../sotre/store_book"
import { StoreKey, _StoreValue, creat_key } from "../store"
import { TranslateType, translate } from "../translation"
import { BookWordMes } from "../word"


export type StateRecite = {
   book_name: string | undefined,//当前背诵的单词本
   filters: string[],//选择的过滤器
   word_list: BookWordMes[],// 从 book_name 中通过filters后的word_list
   index: number,//当前背诵到的下标
   // random_mode:boolean,//是否是随机模式,
}
const default_state_recite = (): StateRecite => {
   return {
      book_name: undefined,
      filters: [],
      word_list: [],
      index: 0,
   }
}


const state_recite_key = creat_key([StoreKey.State, "recite"]);

/// 一个存储状态
/// #oblish
export const sotre_state_recite: {
   value: _StoreValue<StateRecite>,
   translation_map: { [word: string]: TranslateType }, //翻译存储
   index_translation: number,//翻译到的下标
   over_load(book_name: string, filters: StoreFilter[]): void,/// 重新加载value,状态初始化
   get_current_word(): BookWordMes | "over",//获取当前下标的单词,用于初始化获取单词
   next_word(): BookWordMes | "over",// 获取下一个单词,若没有下一个单词就返回over表示结束
   get_translation(word_name: string): TranslateType,//获取一个单词的翻译//todo: 调整这个函数,让它变成异步的
   load_translation_map(): void, //加载翻译
} = {
   value: new _StoreValue(state_recite_key, default_state_recite),
   translation_map: {},
   index_translation: 0,
   over_load(book_name: string, filters: StoreFilter[]) {
      const state_recite: StateRecite = {///状态初始化
         book_name: book_name,
         filters: filters.map(v => v.name),
         word_list: Object.values(book_data.store_books.get_all_word_mes(book_name)),
         index: 0,
      };
      this.index_translation = 0;
      this.translation_map = {};
      this.value.value = state_recite;
      // 过滤
      this.value.value.word_list = filters_word_list(this.value.value.filters.map(v => store_filter.get_filter(v)), this.value.value.word_list)
      // 过滤后,随机打乱
      this.value.value.word_list = this.value.value.word_list.sort((a, b) => (get_random_int(0, 1) ? -1 : 1))

   },
   get_current_word(): BookWordMes | "over" {
      const len = this.value.value.word_list.length;
      const index = this.value.value.index;
      if (index == len) {// 当前index已经是word_list的上限
         return "over";
      }
      this.index_translation = index;
      this.load_translation_map();
      return this.value.value.word_list[index]
   },
   next_word(): BookWordMes | "over" { //由于翻译作为异步流,立刻返回很可能是undefined
      const len = this.value.value.word_list.length;
      const index = this.value.value.index;
      if (index + 1 == len) {// 当前index已经是word_list的上限,无法获取下一个
         return "over";
      }
      if (this.index_translation < index + 1) {//防止内存刷新(软件重新加载),导致this.index_translation==0
         this.index_translation = index + 1;
      }
      if (this.index_translation <= index + 10 + 1) {//提前10个 触发翻译
         this.load_translation_map()
      }
      this.value.value.index++;
      const word = this.value.value.word_list[this.value.value.index];
      return word
   },
   get_translation(word_name: string): TranslateType{
      if (this.translation_map[word_name] == undefined) {
         // todo : 需要删除这个 throw ,它会让软件崩溃
         throw new Error("不应该出现找不到翻译的问题!除非你没网!或异步流还未加载完成");
      } else {
         return this.translation_map[word_name]
      }
   },
   load_translation_map(): void {
      const len = this.value.value.word_list.length;
      Array.from({ length: 15 }, (_, index) => index) //加载15个翻译结果
         .forEach(_ => {
            if (this.index_translation == len) return;///翻译以到上限,停止后面的执行
            const word = this.value.value.word_list[this.index_translation].word;
            this.index_translation++;
            translate(word).then(v => {
               this.translation_map[word] = v;
            })
         })
   }

};




