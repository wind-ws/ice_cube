import { useEffect, useRef, useState } from "react"
import { BookWordMes } from "../serve_app/word";
import { TranslateType } from "../serve_app/translation";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { get_differ_days, get_ymd } from "../tool/time";
import { Icons } from "../serve_app/icons";
import { store_word_golbal } from "../serve_app/sotre_data/store_word_golbal";
import { store_recite_state } from "../serve_app/store_state/sotre_recite_state";
import { ProgressBar, Toast } from "antd-mobile";
import { store_book_data } from "../serve_app/sotre_data/sotre_book_data";
import { store_setting } from "../serve_app/sotre_data/sotre_setting";
import ComModalReciteSetting from "./ComModalReciteSetting";

// 怎么说呢,感觉 这些组件都可以 直接调用 全局状态...
type Props = {
   book_name: string,
   word_name: string,
   // mes: BookWordMes,
   // translations:TranslateType,//翻译结果
   index: number,//当前复习的地方
   len: number,//单词列表的总长度

   on_show: () => void,//告诉 父组件,要触发展开
}

/// 隐藏单词意思的组件,即未展开状态
const ComReciteHide = ({ book_name, word_name, index, len, on_show }: Props) => {

   const [star, set_star] = useState(() => store_word_golbal.get_star(word_name));
   useEffect(() => {
      store_word_golbal.set_star(word_name, star);
   }, [star]);
   const [word_mes, set_word_mes] = useState(() => store_book_data.get_book(book_name).get_mes(word_name))
   const play_audio = () => {
      store_recite_state.get_translation(word_name).match((v) => {
         v.audio.play();
      }, () => {
         Toast.show("音频还未加载完成")
      })
   }
   if (store_setting.value.value.recite.is_auto_pronunciation) {
      play_audio();
   }

   const Head = () => {
      const { isOpen, onOpen, onOpenChange } = useDisclosure();

      return (<div className="block w-full h-20  ">
         <div className="flex flex-1 flex-col w-full h-full ">
            <div className="flex pl-4 w-full">
               <ProgressBar className="w-full"
                  percent={Math.floor((index / len) * 100)}
                  text={`${index}/${len}`}
               />
            </div>
            <div className="flex flex-row gap-x-3 px-4 mt-2 flex-initial items-center justify-end w-full ">

               <Icons.HeroiconsOutline.Cog6ToothIcon onClick={onOpen} className="h-7 text-slate-400" />
            </div>
         </div>
         <ComModalReciteSetting placement={"bottom-center"} isOpen={isOpen} onOpenChange={onOpenChange}/>
      </div>)
   }
   const Body = () => {
      return (<div className="block w-full">
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial place-content-center place-items-center 
                              w-full h-24 ">
               <span className="text-3xl ">{store_setting.value.value.recite.is_listen_mode ? "" : word_name}</span>
            </div>
            <div className="flex flex-1 flex-col place-content-center text-2xl px-2">
               <div className="flex flex-initial flex-row gap-x-2   w-full">
                  <Chip startContent={<p>score</p>} variant="flat" classNames={{
                     base: "bg-gradient-to-br from-green-400 to-cyan-500 border-small border-white/50 shadow-pink-500/30",
                     content: "drop-shadow shadow-black text-white",
                  }}>{word_mes.score}</Chip>
                  <Chip startContent={<Icons.HeroiconsOutline.CheckIcon className="h-4 w-4"></Icons.HeroiconsOutline.CheckIcon>}
                     variant="flat">{word_mes.yes}</Chip>
                  <Chip startContent={<Icons.HeroiconsOutline.XMarkIcon className="h-4 w-4"></Icons.HeroiconsOutline.XMarkIcon>}
                     variant="flat">{word_mes.no}</Chip>
                  <Chip startContent={<Icons.HeroiconsOutline.ClockIcon className="h-4 w-4"></Icons.HeroiconsOutline.ClockIcon>}
                     variant="flat">{get_differ_days(word_mes.last_time)}</Chip>


               </div>
               <div className="flex flex-1 flex-col w-full">

               </div>
            </div>
         </div>
      </div>)
   }
   const Foot = () => {
      return (<div className="block w-full h-48 ">
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial justify-between place-items-center 
                              w-full h-24 px-10 ">
               <Icons.HeroiconsOutline.SpeakerWaveIcon className="h-7 w-7 text-blue-500"
                  onClick={play_audio}></Icons.HeroiconsOutline.SpeakerWaveIcon>


               {
                  star ?
                     <Icons.HeroiconsSolid.StarIcon className="h-7 w-7 text-yellow-300"
                        onClick={() => {
                           set_star(false);
                        }}></Icons.HeroiconsSolid.StarIcon>
                     :
                     <Icons.HeroiconsOutline.StarIcon className="h-7 w-7 text-yellow-500"
                        onClick={() => {
                           set_star(true);
                        }}></Icons.HeroiconsOutline.StarIcon>
               }

               <Icons.HeroiconsOutline.SpeakerWaveIcon className="h-7 w-7 text-blue-500"
                  onClick={play_audio}></Icons.HeroiconsOutline.SpeakerWaveIcon>
            </div>
            <div className="flex flex-1 place-content-center place-items-center w-full h-14 ">
               <div className="flex justify-center items-center w-[80%] h-[60%] 
                  rounded-lg active:bg-blue-100"
                  onClick={on_show}>
                  <Icons.HeroiconsOutline.EyeIcon className="h-8 w-8 text-blue-500"></Icons.HeroiconsOutline.EyeIcon>
               </div>
            </div>
         </div>
      </div>)
   }
   return (<div className="w-full h-full bg-slate-100" style={{ height: "100vh" }}>
      <div className="flex flex-col" style={{ height: "100vh" }}>
         <div className="flex flex-initial w-full h-20  ">
            <Head></Head>
         </div>
         <div className="flex flex-1">
            <Body></Body>
         </div>
         <div className="flex flex-initial w-full h-48 ">
            <Foot></Foot>
         </div>
      </div>
   </div>)
}

export default ComReciteHide