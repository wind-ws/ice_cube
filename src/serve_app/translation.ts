// 妈的,编译出来的app,居然不能访问网络...,鬼知道什么问题...,先不用axios,用用他们官方的插件
import axios, { AxiosResponse } from "axios";
import { fetch } from '@tauri-apps/plugin-http';
import { Howler, Howl } from "howler";
import { IsRelease, is_release } from "../tool/condiction";
import { debug_time } from "../tool/debug";

/// 通过代理访问
/// 在编码阶段,需要用这个,不然一堆err,虽然没有啥影响...
const proxy_translate_text_url =
   (word: string): string => `/translation_text?c=word&m=getsuggest&nums=1&is_need_mean=1&word=${word}`;
/// 实际地址
const translate_text_url =
   (word: string): string => `https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=1&is_need_mean=1&word=${word}`;

/// 使用的地址
export const use_translate_text_url = (word: string): string =>
   is_release ? translate_text_url(word) : proxy_translate_text_url(word)

/// 通过代理访问
const proxy_translate_audio_url =
   (word: string): string => `/translation_audio?audio=${word}&type=2`;
/// 实际地址
const translate_audio_url =
   (word: string): string => `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;
/// 使用的地址
export const use_translate_audio_url = (word: string): string =>
   is_release ? translate_audio_url(word) : proxy_translate_audio_url(word)



/**
 * 发起一个get请求
 */
const get = (url: string): Promise<IsRelease extends true ? Response : AxiosResponse<any, any>> => {
   if (is_release || true) {//奇怪,这个新API只能用fetch和非跨域
      return fetch(url, {
         method: 'GET',
      }) as any
   } else {
      return axios.get(url) as any
   }
}

/// 翻译后返回的类型 (只取了需要的部分)
export type TranslateType = {
   readonly word: string,//单词本身
   readonly paraphrase: string,//释义(means的整合)
   readonly means: {//更加精准的释义()
      part: string,//词性
      means: string[]//释义
   }[],
   readonly audio: Howl,//音频 (在new的时候就发起请求(缓存音频))
}

/// 翻译
export const translate = async (word: string): Promise<TranslateType> => {
   return new Promise((resolve, reject) => {
      const text_url = iciba.use_iciba_translate_text_url(word);
      get(text_url).then((response: any) => {         
         if (is_release || true) {
            response.json().then((data: iciba.Iciba) => {
               resolve(iciba.get_translate_type(data))
            })
         } else {
            const data: iciba.Iciba = response.data;
            resolve(iciba.get_translate_type(data))
         }
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
      (word: string): string => `https://www.iciba.com/_next/data/dTlbEbttstfo-ZBl63u0M/word.json?w=${word}`;
   /// 通过代理访问
   const proxy_iciba_translate_text_url =
      (word: string): string => `/iciba_translation_text?w=${word}`;
   /// 使用的地址
   /// 就奇了怪了,这个代理跨域就不能用了...
   export const use_iciba_translate_text_url = (word: string): string =>
      is_release || true ? iciba_translate_text_url(word) : proxy_iciba_translate_text_url(word)
   
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
                        parts: {
                           part: string,//词性
                           means: string[],//释义
                        }[]
                     }[],
                  }
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
         audio: new Howl({
            src: use_translate_audio_url(word),
            format: "mpeg",
            preload: true,
         })
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





