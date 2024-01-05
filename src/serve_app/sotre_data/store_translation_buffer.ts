import { Store } from "@tauri-apps/plugin-store";
import { StoreFile, StoreValue } from "../store";
import { TranslateType, translate, use_translate_audio_url } from "../translation";
import { Option, none, some } from "../../tool/option";
import { get_random_int } from "../../tool/random";

// 翻译缓存
// 每次翻译都更新存储缓存,保证翻译是最新数据
// 翻译缓存 保证 立刻渲染,不再因为网络io的问题 等待翻译结果


const default_key = StoreFile.TranslationButter;
const store = new Store(StoreFile.TranslationButter);

type StoreTranslationBuffer = {
   [word: string]: Omit<TranslateType, "audio">
}


export const store_translation_buffer: {
   value: StoreValue<StoreTranslationBuffer>,
   audio_buffer: { [word_name: string]: Howl },
   get_translation(word_name: string): Option<TranslateType>,
   /**
    * 更新单词的信息
    * @param word_name 
    */
   updata(word_name: string): void,
} = {
   value: new StoreValue(store, default_key, () => ({}), true, false, false),
   audio_buffer: {},
   get_translation(word_name: string): Option<TranslateType> {
      if (this.value.value[word_name] == undefined) {
         this.updata(word_name)
         return none()
      } else {
         if (get_random_int(0, 500) == 0) {//随缘更新(单词翻译变化的可能性太低,所以这样随缘更新新数据)
            this.updata(word_name)
         }
         if (this.audio_buffer[word_name] == undefined) {
            this.audio_buffer[word_name] = new Howl({
               src: use_translate_audio_url(word_name),
               format: "mpeg",
               preload: true,
            })
         }
         return some({
            ...this.value.value[word_name],
            audio: this.audio_buffer[word_name]
         })
      }
   },
   updata(word_name: string): void {
      if (this.audio_buffer[word_name] == undefined) {
         this.audio_buffer[word_name] = new Howl({
            src: use_translate_audio_url(word_name),
            format: "mpeg",
            preload: true,
         })
      }
      translate(word_name).then(v => {
         this.value.value[word_name] = {//更新翻译数据
            word: v.word,
            means: v.means,
            paraphrase: v.paraphrase
         }
      })
   }
}

