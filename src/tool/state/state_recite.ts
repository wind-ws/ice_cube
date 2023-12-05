/// 背诵中的全局状态

import { StoreFilter, filters_word_list } from "../filter"
import { book_data } from "../sotre/store_book"
import { BookWordMes } from "../word"


type StateRecite = {
   book_name: string,//当前背诵的单词本
   filters: StoreFilter[],//选择的过滤器
   word_list:book_data.WordList,// 从 book_name 中通过filters后的word_list
   // random_mode:boolean,//是否是随机模式,
}
type StateReciteFn = {
}

export const builder_state_recite_fn = (book_name:string,filters:StoreFilter[]):StateReciteFn=>{
   var state_recite:StateRecite = {
      book_name:book_name,
      filters: filters,
      word_list: book_data.store_books.get_all_word_mes(book_name),
      // random_mode:true,
   }
   const filter_word_list = ()=>{
      // state_recite.word_list=filters_word_list(state_recite.filters,state_recite.word_list)
   };

   filter_word_list();
   return {

   }
}

