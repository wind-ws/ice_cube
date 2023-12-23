import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";
import { BookWordMes } from "../word";
import { TranslateType } from "../translation";
import { StoreFilter } from "../filter";
import { Result } from "../../tool/result";
import { Option, none, some } from "../../tool/option";
import { store_book_data } from "../sotre_data/sotre_book_data";

const default_key = StoreFile.StateRecite;
const store = new Store(StoreFile.StateRecite);

export type StateRecite = {
   book_name: Option<string>,//当前背诵的单词本
   filters: string[],//选择的过滤器
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
const store_recite_state: {
   value: StoreValue<StateRecite>,
   /// 翻译存储
   translation_map: { [word: string]: TranslateType },
   /// 翻译到的下标 
   index_translation: number,
   /// 重新加载value,全部状态初始化
   over_load(book_name: string, filters: StoreFilter[]): void,
   /// ok(None):表示没有下一个单词啦~ 
   /// err(any):err的情况有 [翻译未加载完成,...]
   next_word():Promise<Result<Option<[BookWordMes,TranslateType]>,any>>
} = {
   value: new StoreValue(store, default_key, default_recite_state),
   translation_map: {},
   index_translation: 0,
   over_load: function (book_name: string, filters: StoreFilter[]): void {
      const recite_state: StateRecite = {//状态初始化
         book_name: some(book_name),
         filters: filters.map(v => v.name),
         word_list: Object.values(store_book_data.get_book(book_name).get_all_word_mes()),
         index: 0,
      };
      this.index_translation = 0;
      this.translation_map = {};
      this.value.value = recite_state;
   },
   next_word: function (): Promise<Result<Option<[BookWordMes, TranslateType]>, any>> {
      throw new Error("Function not implemented.");
   }
}


