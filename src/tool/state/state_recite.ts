/// 背诵中的全局状态

import { StoreFilter, filters_word_list } from "../filter"
import { get_random_int } from "../random"
import { book_data } from "../sotre/store_book"
import { TranslateType, translate } from "../translation"
import { BookWordMes } from "../word"


type StateRecite = {
   book_name: string,//当前背诵的单词本
   filters: StoreFilter[],//选择的过滤器
   word_list: BookWordMes[],// 从 book_name 中通过filters后的word_list
   index: number,//当前背诵到的下标
   index_translation: number,//翻译到的下标
   translation_queue: { [word: string]: TranslateType },//翻译存储
   // random_mode:boolean,//是否是随机模式,
}
type StateReciteFn = {
   next_word(): BookWordMes | "over",/// 获取下一个单词,若已经超过最后一个单词,则返回over
   // set_star(star:boolean):void,//设置当前单词的star
}

export const builder_state_recite_fn = (book_name: string, filters: StoreFilter[]): StateReciteFn => {
   var state_recite: StateRecite = {///全局状态初始化
      book_name: book_name,
      filters: filters,
      word_list: Object.values(book_data.store_books.get_all_word_mes(book_name)),
      index: 0,
      index_translation: 0,
      translation_queue: {}
      // random_mode:true,
   }
   const filter_word_list = () => {
      state_recite.word_list = filters_word_list(state_recite.filters, state_recite.word_list)
      /// 过滤后,随机打乱
      state_recite.word_list = state_recite.word_list.sort((a, b) => (get_random_int(0, 1) ? -1 : 1))
   };
   const load_translation_queue = () => {
      Array.from({ length: 10 }, (_, index) => index) //加载10个翻译结果
         .forEach(v => {
            if(state_recite.index_translation==state_recite.word_list.length) return ;
            const word = state_recite.word_list[state_recite.index_translation].word;
            state_recite.index_translation++;
            translate(word).then(v => {
               state_recite.translation_queue[word] = v;
            })
         })
   }

   filter_word_list();
   load_translation_queue();
   return {
      next_word(): BookWordMes | "over" {
         if (state_recite.index == state_recite.word_list.length - 1)
            return "over";
         // delete state_recite.translation_queue[state_recite.word_list[state_recite.index].word]//删除一个翻译
         if(state_recite.index+5==state_recite.index_translation){//提前5个加载
            load_translation_queue()
         }
         state_recite.index++;
         return state_recite.word_list[state_recite.index];
      }
   }
}

/// 当前选择的book和filters
export const state_select:{
   book_name:string|undefined,
   filters:string[]
} = {
   book_name: undefined,
   filters:[]
};



