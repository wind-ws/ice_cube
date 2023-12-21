import axios from "axios";
import { Howler,Howl } from "howler";

const translate_text_url = 
   (word:string):string => `/translation_text?c=word&m=getsuggest&nums=1&is_need_mean=1&word=${word}`;

const translate_audio_url = 
   (word:string):string => `/translation_audio?audio=${word}&type=2`;

/// 翻译后返回的类型 (只取了需要的部分)
export type TranslateType = {
   key: string,//单词本身
   paraphrase:string,//释义(means的整合)
   means:{//更加精准的释义()
      part:string,//词性
      means:string[]//释义
   }[],
   audio:Howl,//音频 (不清楚它是在play时发起请求,还是在new时就发起请求(把数据缓存起来了))
}

/// 翻译
export const translate = async (word:string):Promise<TranslateType> =>{
   return new Promise((resolve, reject) =>{
      const text_url=translate_text_url(word);
      const audio_url=translate_audio_url(word);
      let translation:TranslateType;
      axios.get(text_url).then(response =>{
         const data = response.data.message[0];
         const audio = new Howl({
            src:audio_url,
            format:"mpeg",
         });
         translation={
            key:data.key,
            paraphrase:data.paraphrase,
            means:data.means,
            audio:audio
         }
         resolve(translation)
      }).catch(e=>reject(e));


   })
}







