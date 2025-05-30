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
export type StoreState = {
   /** 背诵的记录状态保持 */
   recite_state: Option<mod_recite_state.ReciteState>,
}
const default_store_state = (): StoreState => {
   return {
      recite_state: none(),
   }
}
export const store_state = new StoreValue(StoreFile.State, default_store_state)

// todo : 还需要一个功能: 返回到上一个单词 (因为复习速度太快,可能出现误点(误操作))

export namespace mod_recite_state {

   /** 
    * default: 跟随全局控制的背诵模式
    * normal : 显示 单词 正常的点击展开后 显示翻译 点击 认识 或 不认识
    * spelling : 显示 翻译 进行拼写整个单词 (可点击发音)(通过设置可以给予重新拼写的机会,若不给机会,则直接判断为不认识)
    * listen : 什么都不显示 只发音 ,点击展开后 显示翻译 点击 认识 或 不认识
   */
   type ReciteMode = "default" | "normal" | "spelling" | "listen";

   type ReciteItem = {
      word_name: string,
      /** 这个单词连续错误的次数 
       * 连续错误会扣更多的分
      */
      successive_failing: number,
      /** 当前单词的背诵模式, 可能未来还会存在 全局控制 背诵模式, 这个是更低颗粒度的控制  */
      mode: ReciteMode
   }
   type ReciteList = ReciteItem[];
   export type ReciteState = {
      /** 背诵的单词列表 */
      list: ReciteList,
      /** 当前背诵到的位置 */
      index: number,
      /** 当前连续正确的次数 */
      successive_right: number,


      /** 需要背诵的单词总数 */
      readonly total: number,
      /** 已完成背诵的单词数量 */
      completed: number,
      /** 背诵的单词本 */
      book_name: string,
   }
   /** 音频加载到的位置(当前位置还未加载(前一个以加载)) */
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
      preload_audio(recite_state.list.slice(recite_state.index, min(recite_state.list.length, recite_state.index + 10))
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
   /** 获取状态中的单词本名 */
   export function get_book_name(): string | null {
      const [get, _] = store_state.render();
      return option_fn(get.recite_state).match((v) => {
         return v.book_name
      }, () => null)
   }
   /** 预加载一个音频(audio_load_index单词的) */
   export function preload_one_audio() {
      const [get, _] = store_state.render();
      const recite_state = option_fn(get.recite_state).unwrap();
      if (recite_state.list.length - 1 >= audio_load_index) {
         preload_audio([recite_state.list[audio_load_index].word_name]);
         audio_load_index = audio_load_index + 1;
      }
   }

   /** 获取当前单词 */
   export function current_word(): Option<string> {
      const [get, _] = store_state.render();
      const recite_state = option_fn(get.recite_state).unwrap();
      if (recite_state.index == recite_state.list.length) {
         return none()
      }
      return some(recite_state.list[recite_state.index].word_name)
   }

   /**   
    * 进入下一个单词
    * @returns {boolean} : true 表示 还存在单词, false 表示不存在单词了
    */
   export function next(): boolean {
      const [get, set] = store_state.render();
      const recite_state = option_fn(get.recite_state).unwrap();
      if (recite_state.index + 1 == recite_state.list.length) {
         return false
      }
      set("recite_state", produce(v => {
         option_fn(v).match((v) => {
            v.index = v.index + 1;
         }, () => { });
      }))
      preload_one_audio()
      return true
   }
   /** 表示执行 "认识" 需要的数据处理
    * 获取score进行需要的数据处理 */
   export function yes(score: number, word_name: string, book_name: string) {
      const [book, set_book] = store_book.render();
      set_book(book_name, "word_list", produce(t => {
         t[word_name].yes = t[word_name].yes + 1;
         t[word_name].last_time = now();
         t[word_name].score = t[word_name].score + score;
      }));
      store_book.save_debounced_fn();
   }
   /** 表示执行 "不认识" 需要的数据处理
    *  获取score进行需要的数据处理 
    *  score<0
    * */
   export function no(score: number, word_name: string, book_name: string) {
      const [book, set_book] = store_book.render();
      set_book(book_name, "word_list", produce(t => {
         t[word_name].no = t[word_name].no + 1;
         t[word_name].last_time = now();
         t[word_name].score = t[word_name].score + score;
      }))

      store_book.save_debounced_fn();
   }

   /** 向index后面随机位置(10~20)插入一个单词 ,如果 insertIndex 超出了数组的长度，splice() 方法会将元素插入到数组的尾部*/
   export function insert_word(word_name:string,mode:ReciteMode) {
      const [get, set] = store_state.render();
      set("recite_state", produce(v => {
         option_fn(v).match((v)=>{
            v.list.splice(random_int(v.index + 10, v.index + 20), 0, {
               word_name: word_name,
               successive_failing: v.list[v.index].successive_failing + 1,
               mode: mode
            })
         },()=>{})
      }))

   }


}

