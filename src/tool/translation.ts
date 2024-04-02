// // 妈的,编译出来的app,居然不能访问网络...,鬼知道什么问题...,先不用axios,用用他们官方的插件
import axios, { AxiosResponse } from "axios";
import { fetch } from '@tauri-apps/plugin-http';
import { Howler, Howl } from "howler";
import { IsRelease, is_release } from "./condiction";



/// 实际地址
const translate_audio_url =
   (word: string): string => `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;

const audio_buffer: {
   [word_name: string]: Howl
} = {};

/** 提前加载音频,提高用户体验 */
export function preload_audio(word_name_list: string[]) {
   word_name_list.forEach(word_name => {
      if (audio_buffer[word_name] === undefined) {
         audio_buffer[word_name] = new Howl({
            src: translate_audio_url(word_name),
            format: "mpeg",
            preload: true,
         })
      }
   })
}
/** 获取音频 */
export function get_audio(word_name: string) {
   if (audio_buffer[word_name] === undefined) {
      audio_buffer[word_name] = new Howl({
         src: translate_audio_url(word_name),
         format: "mpeg",
         preload: true,
      })
   }
   return audio_buffer[word_name];
}



/// 翻译后返回的类型 (只取了需要的部分)
export type TranslateType = {
   readonly word: string,//单词本身
   readonly paraphrase: string,//释义(means的整合)
   readonly means: {//更加精准的释义()
      part: string,//词性
      means: string[]//释义
   }[],
   /** 变形 */
   readonly exchanges: string[],
   /** 词组 */
   readonly phrase: string[],
   /** 反义词 */
   readonly antonym: string[],
   /** 近义词 */
   readonly synonym: string[],

   // readonly audio: Howl,//音频 (在new的时候就发起请求(缓存音频))
}
/** 存储的翻译类型 */
export type TranslateTypeStore = Omit<TranslateType, "audio">;

/// 翻译
export const translate = async (word: string): Promise<TranslateType> => {   
   return new Promise((resolve, reject) => {
      const text_url = iciba.iciba_translate_text_url(word);
      fetch(text_url, {
         method: 'GET',
      }).then((res) => {
         res.json().then((data: iciba.Iciba) => {
            resolve(iciba.get_translate_type(data))
         })
      })
   })
}



/**
 * iciba 翻译支持
 * 这个翻译的内容非常丰富,但是我们任然取去我们需要的内容
 */
namespace iciba {
   /// 实际地址
   export const iciba_translate_text_url =
      (word: string): string => `https://www.iciba.com/_next/data/Oo2lhUMf85DZ7OJMbFn8g/word.json?w=${word}`;

   /// 请求返回的类型 (部分内容)
   export type Iciba = {
      pageProps: {
         initialReduxState: {
            word: {
               wordInfo: {
                  baesInfo: {
                     word_name: string,
                     exchange: { [exchange_name: string]: string[] },//变形
                     symbols: {
                        ph_en_mp3: string,
                        ph_am_mp3: string,
                        parts: {
                           part: string,//词性
                           means: string[],//释义
                        }[]
                     }[],
                  },
                  phrase: {
                     cizu_name: string,//词组
                  }[],
                  synonym: {
                     means: {
                        cis: string[]
                     }[]
                  }[]
                  antonym: {
                     means: {
                        cis: string[]
                     }[]
                  }[]
               }
            }
         }
      }
   }
   export const get_translate_type = (value: Iciba): TranslateType => {
      const word = value.pageProps.initialReduxState.word.wordInfo.baesInfo.word_name;
      return {
         word: word,
         paraphrase: get_paraphrase(value),
         means: get_means(value),
         exchanges: [],
         phrase: [],
         antonym: [],
         synonym: [],
         // audio: new Howl({
         //    src: translate_audio_url(word),
         //    format: "mpeg",
         //    preload: true,
         // })
      }
   }

   const get_means = (value: Iciba): TranslateType["means"] => {
      const ret: TranslateType["means"] = [];
      const a: { [part: string]: string[] } = {};
      value.pageProps.initialReduxState.word.wordInfo.baesInfo.symbols
         .forEach(v => {
            v.parts.forEach(v => {
               if (a[v.part] == undefined) a[v.part] = [];
               a[v.part] = a[v.part].concat(v.means);
            })
         })
      Object.entries(a).forEach(([k, v]) => {
         ret.push({
            part: k,
            means: v
         })
      })
      return ret
   }
   const get_paraphrase = (value: Iciba): TranslateType["paraphrase"] => {
      return get_means(value).map(v => `${v.part} ${v.means.join()}`).join("\n");
   }
}





