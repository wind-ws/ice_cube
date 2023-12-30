// 妈的,编译出来的app,居然不能访问网络...,鬼知道什么问题...,先不用axios,用用他们官方的插件
import axios from "axios";
import { fetch } from '@tauri-apps/plugin-http';
import { Howler, Howl } from "howler";
import { is_release } from "../tool/condiction";
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
      const text_url = use_translate_text_url(word);
      const audio_url = use_translate_audio_url(word);
      let translation: TranslateType;
      if (is_release) {
         fetch(text_url, {
            method: 'GET',
         }).then(response => {
            response.json().then(v => {
               const data = v.message[0];
               const audio = new Howl({
                  src: audio_url,
                  format: "mpeg",
                  preload: true,
               });
               translation = {
                  word: data.key,
                  paraphrase: data.paraphrase,
                  means: data.means,
                  audio: audio
               }
               resolve(translation)
            })
         }).catch(e => reject(e));
      } else {
         axios.get(text_url).then(response => {
            const data = response.data.message[0];
            const audio = new Howl({
               src: audio_url,
               format: "mpeg",
               preload: true,
            });
            translation = {
               word: data.key,
               paraphrase: data.paraphrase,
               means: data.means,
               audio: audio
            }
            resolve(translation)
         }).catch(e => reject(e));
      }

   })
}







