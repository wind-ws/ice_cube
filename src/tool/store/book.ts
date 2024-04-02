import { StoreFile, StoreValue } from "../store";
import { now } from "../time";
import { TranslateTypeStore, translate } from "../translation";
import { set_label_for_setting, store_setting } from "./setting";
import { Option, none, option_fn, some } from "../option";
import { produce } from "solid-js/store";
import { batch } from "solid-js";

export namespace word {

   // 规范化一下类型
   type WordName = string;
   type BookName = string;
   

   /// 每一个单词的全局数据类型
   export type GlobalWord = {
      word: string; // 单词本身
      /** 自定义笔记 #abolish:禁止使用 */
      note: string,
      /** 关联词 (可自定义,初始化为空) 
       * 建立关联后,对方也会建立关联
       * 例如 a关联b和c,不止a存在bc,bc也会存在a ,但 b和c不会互相存在
       * 通过二阶展开关联词,来通过b观察c, b展开a的关联词则观察c
      */
      related_word: string[],
      star: boolean,// 重点关注 
      label: string[],//标签
      /** 自定义翻译结果,在显示翻译时,会自动添加到显示结果中 */
      custom_translation: {
         [part: string]: string[]
      },
      /** 翻译 (翻译缓存)(可自定义,初始化为 翻译内容, 可手动刷新翻译内容) 
       * 使用时进行翻译加载
       */
      translation: Option<TranslateTypeStore>,
      /** 全局正确次数 */
      yes: number,
      /** 全局错误次数 */
      no: number
   }
   export const default_golbal_word_mes = (word: string): GlobalWord => {
      return <GlobalWord>{
         word: word,
         note: "",
         related_word: [] as string[],
         star: false,
         label: [] as string[],
         translation: none(),
         yes: 0,
         no: 0,
      }
   }
   /// 单词本独享的信息
   /// 每一个单词的类型
   export type Word = {
      word: string,//单词本身
      yes: number,//正确次数,不能为负数
      no: number,//错误次数,不能为负数
      score: number,//综合评分,整数,可以为负数, 分数的绝对值 越高增长越少, 越高也降的越多 , 越少增加的越多
      last_time: number, //上次遇到它的时间
      readonly first_time: number, //第一次遇到它的时间 , 0表示还没遇到过 (设置时间后,不可再变)
   }
   /// Word 的默认值
   export const default_book_word_mes = (word: string): Word => {
      return <Word>{
         word: word,
         yes: 0,
         no: 0,
         score: 0,
         last_time: now(),
         first_time: 0
      }
   }


}

export type StoreGlobalWordData = {
   [word: string]: word.GlobalWord
}
export const store_global = new StoreValue<StoreGlobalWordData>(StoreFile.BookGolbal, () => ({}))

export namespace store_global_fn {
   /** 
    * ! 不安全函数! 不可在发布中使用它 ! 只能用于开发时
    */
   export function unsafe_delete_add_word() {
      const [get_global, set_global] = store_global.render();
      batch(() => {
         Object.keys(get_global).forEach(v => {
            set_global(produce(u => {
               delete u[v];
            }))
         })
      })
      store_global.save();
   }

   /** 存在不覆盖
    * 去抖 磁盘存储
    */
   export function add_global_word(word_name: string) {
      const [get_global, set_global] = store_global.render();
      if (get_global[word_name] == undefined) {
         set_global(word_name, word.default_golbal_word_mes(word_name))
         store_global.save_debounced_fn();
      }
   }
   /** 不存在则创建
    * 去抖 磁盘存储
    */
   export function set_star(word_name: string, star: boolean) {
      const [_, set_global] = store_global.render();
      add_global_word(word_name);
      set_global(word_name, "star", star);
      store_global.save_debounced_fn();
   }
   /** 不存在则创建
    * 去抖 磁盘存储
    * ! 可能存在性能问题
    */
   export function set_related_word(word_name: string, related_word: string[]) {
      const [get_global, set_global] = store_global.render();
      add_global_word(word_name);
      related_word = Array
         .from(new Set(related_word.concat(get_global[word_name].related_word)))// 去重
      related_word.forEach(v => {
         add_global_word(v);//初始化所有 关联词
         if (!get_global[v].related_word.includes(word_name)) {
            set_global(v, "related_word", produce(v => {
               v.push(word_name);
            }))
         }
      });
      set_global(word_name, "related_word", related_word)
      store_global.save_debounced_fn();
   }
   /** 不存在则创建 
    *  去抖 磁盘存储
   */
   export function set_label(word_name: string, label: string[]) {
      const [get_global, set_global] = store_global.render();
      add_global_word(word_name);
      label = Array
         .from(new Set(label.concat(get_global[word_name].label)))// 去重
      set_global(word_name, "label", produce(v => {
         v.push(...label);
      }));
      label.forEach(v => set_label_for_setting(v))
      store_global.save_debounced_fn();
   }
   /** 不存在则创建 
    * 
    */
   export function get_star(word_name: string) {
      const [get_global, _] = store_global.render();
      add_global_word(word_name);
      return get_global[word_name].star
   }

   /** 存在不覆盖的 加载 翻译内容 */
   export function load_translation(word: string) {
      const [get, set] = store_global.render();
      if (get[word] !== undefined) {
         if (true || option_fn(get[word].translation).is_none()) {
            translate(word).then(v => {
               set(word, produce(t => {
                  console.log(word);

                  t.translation = some(v as TranslateTypeStore)
               }))
               store_global.save_debounced_fn();
            })
         }
      }
   }
   /** 不存在则加载翻译 */
   export function get_translation(word: string): Option<TranslateTypeStore> {
      const [get, set] = store_global.render();

      if (get[word] !== undefined) {
         return option_fn(get[word].translation).match((v) => {
            return some(v)
         }, () => {
            load_translation(word);//加载翻译
            return none()
         })
      }

      return none()
   }
}

type BookData = {
   book_name: string, //书名
   /** 创建时间 */
   readonly create_time: number,
   /** 上次使用单词本的时间 */
   last_use_time: number,
   word_list: {//单词列表
      [word: string]: word.Word
   }
}
export type StoreBookData = {
   [book_name: string]: BookData
}
export const store_book = new StoreValue<StoreBookData>(StoreFile.BookData, () => ({}))

export namespace store_book_fn {

   /** //! 存在也覆盖 (调用请先检查是否存在这个book_name)
    * 
    */
   export function add_book(book_name: string) {
      const [get, set] = store_book.render();
      const [get_setting, set_setting] = store_setting.render();
      set(book_name, <BookData>{
         book_name: book_name,
         create_time: now(),
         last_use_time: now(),
         word_list: {}
      });
      if (get_setting.recite.book_name == "") {// 初始化第一个单词本的设置
         set_setting("recite", "book_name", book_name);
         store_setting.save();
      }
      store_book.save()
   }
   /** 删除单词本 , 磁盘存储
    * 若设置是这个单词本,那么设置会 随便选一个单词本放上去 (若没单词本后,设置会变为"")
    */
   export function delete_book(book_name: string) {
      const [get, set] = store_book.render();
      const [get_setting, set_setting] = store_setting.render();
      set(produce(v => {
         delete v[book_name];
      }));
      if (get_setting.recite.book_name == book_name) {
         const book_name_list = Object.keys(get);
         if (book_name_list.length == 0) {
            set_setting("recite", "book_name", "");
         } else {
            set_setting("recite", "book_name", book_name_list[0]);
         }
      }
      store_book.save();
      store_setting.save();
   }

   /** 存在不覆盖
    *  触发 去抖磁盘存储
    */
   export function add_word(book_name: string, word_name: string) {
      const [get, set] = store_book.render();
      if (get[book_name].word_list[word_name] == undefined) {
         set(book_name
            , "word_list"
            , word_name
            , word.default_book_word_mes(word_name));
      }
      store_book.save_debounced_fn();
   }
   /** 删除一个单词 */
   export function delete_word(book_name: string, word_name: string) {
      const [get, set] = store_book.render();
      set(book_name, "word_list", produce(v => {
         delete v[word_name];
      }))
      store_book.save_debounced_fn();
   }

   export function get_wrod_list(book_name: string) {
      const [get, set] = store_book.render();
      return Object.values(get[book_name].word_list)
   }

   /** 这是一个分数增加函数,输入当前分数输出应该增加的分数 */
   export function plus_score(score: number) {
      const f = (x: number): number => Math.ceil(-((99) / (2000)) * x + ((101) / (2)));
      if (score > 1000) {
         return 1
      } else if (score < -1000) {
         return 100
      }
      return f(score)
   }
   /** 这是一个分数减少函数,输入当前分数输出应该减少的分数 
    * 总是返回正数
   */
   export function minus_score(score: number) {
      const f = (x: number): number => Math.ceil(-((99) / (2000)) * x + ((101) / (2)));
      if (score > 1000) {
         return 100
      } else if (score < -1000) {
         return 1
      }
      return -f(score) + 101
   }
}

