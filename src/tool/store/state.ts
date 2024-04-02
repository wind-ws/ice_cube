import { StoreFile, StoreValue } from "../store";
import { Option, none, option_fn, some } from "../option";
import { StoreFilter, filters_word_list } from "../filter";
import { store_book, store_book_fn } from "./book";
import { random_int } from "../random";
import { store_setting } from "./setting";
import { preload_audio } from "../translation";
import { min } from "../number";
import { produce } from "solid-js/store";
import { panic } from "../auxiliary_fn";
import { now } from "solidjs-use";

/**
 * 存储需要保持的状态信息
 */
type StoreState = {
   /** 背诵的记录状态保持 */
   recite_state: Option<mod_recite_state.ReciteState>,
}
const default_store_state = (): StoreState => {
   return {
      recite_state: none(),
   }
}
export const store_state = new StoreValue(StoreFile.State, default_store_state)


export namespace mod_recite_state {

   type ReciteItem = {
      word_name: string,
      /** 连续错误次数 */
      successive_failing: number,
   }
   type ReciteList = ReciteItem[];
   export type ReciteState = {
      list: ReciteList,
      index: number,//当前背诵到的位置
      /** 连续正确次数 */
      successive_right: number,
      /** 背诵的单词本 */
      book_name: string,
   }
   /** 音频加载到的位置 */
   let audio_load_index: number = 0;

   /** 重载背诵状态 
    * @param [random=false] 是否随机排列
   */
   export function reload_recite_state(random: boolean = false) {
      const [get, set] = store_state.render();
      const [get_setting, set_setting] = store_setting.render();
      const book_name = get_setting.recite.book_name;
      const filters: StoreFilter[] = [];
      get_setting.recite.filter_name_list.forEach(v => {
         filters.push(get_setting.filters[v])
      })
      let list = filters_word_list(filters, store_book_fn.get_wrod_list(book_name))
         .map(v => (<ReciteItem>{
            word_name: v.word,
            successive_failing: 0,
         }))
      if (random) {
         list = list.sort(() => random_int(-1, 1));
      }
      set("recite_state", some({
         list: list,
         index: 0,
         successive_right: 0,
         book_name: book_name
      }));
      audio_load_index = 0;
      preload_audio(list.slice(0, min(list.length, 10))
         .map(v => {
            audio_load_index = audio_load_index + 1;
            return v.word_name;
         })) //预加载10个音频
      store_state.save_debounced_fn();
   }
   /** 做一些 加载状态 初始化的事情 */
   export function load_recite_state() {
      const [get, _] = store_state.render();
      const recite_state = option_fn(get.recite_state).unwrap();
      audio_load_index = recite_state.index;
      preload_audio(recite_state.list.slice(0, min(recite_state.list.length, 10))
         .map(v => {
            audio_load_index = audio_load_index + 1;
            return v.word_name;
         }))//预加载10个音频

   }
   /** 清空状态 */
   export function clear_recite_state() {
      const [get, set] = store_state.render();
      set("recite_state", none<ReciteState>())
   }
   /** 是否存在背诵记录状态 */
   export function is_recite_state(): boolean {
      const [get, _] = store_state.render();
      return option_fn(get.recite_state).is_some()
   }

   /** 获取当前单词 */
   export function current_word(): Option<string> {
      const [get, _] = store_state.render();
      const recite_state = option_fn(get.recite_state).unwrap();
      if (recite_state.index == recite_state.list.length) {
         return none()
      }
      if (recite_state.list.length - 1 - recite_state.index >= 10) {//加载第后10个
         audio_load_index = audio_load_index + 1;
         preload_audio([recite_state.list[recite_state.index + 10].word_name]);
      }
      return some(recite_state.list[recite_state.index].word_name)
   }

   /**   进入下一个单词
    *    score<0: 不认识这个单词
    *    score>0: 认识这个单词
    */
   export function next(score: number) {
      const [get, set] = store_state.render();
      const [book, set_book] = store_book.render();
      const recite_state = option_fn(get.recite_state).unwrap();
      const word_name = recite_state.list[recite_state.index].word_name;
      if (recite_state.index + 1 == recite_state.list.length) {
         return panic("应该在业务逻辑上,保证无法触发这个panic");
      }
      if (score < 0) {
         set("recite_state", produce(v => {
            option_fn(v).match((v) => {
               v.index = v.index + 1;
               v.successive_right = 0;
               set_book(v.book_name, "word_list", produce(t => {
                  t[word_name].no = t[word_name].no + 1;
                  t[word_name].last_time = now();
                  t[word_name].score = t[word_name].score + score;
               }))
               /** 向index后面随机位置(10~20)插入一个单词 ,如果 insertIndex 超出了数组的长度，splice() 方法会将元素插入到数组的尾部*/
               v.list.splice(random_int(v.index + 10, v.index + 20), 0, {
                  word_name: word_name,
                  successive_failing: recite_state.list[recite_state.index].successive_failing + 1
               })
            }, () => { });
         }))
      } else {
         set("recite_state", produce(v => {
            option_fn(v).match((v) => {
               v.index = v.index + 1;
               v.successive_right = v.successive_right + 1;
               set_book(v.book_name, "word_list", produce(t => {
                  t[word_name].yes = t[word_name].yes + 1;
                  t[word_name].last_time = now();
                  t[word_name].score = t[word_name].score + score;
               }))
            }, () => { });
         }))
      }
      store_state.save_debounced_fn();
      store_book.save_debounced_fn();
   }



}

