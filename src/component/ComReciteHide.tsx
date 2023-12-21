import { useEffect, useRef, useState } from "react"
import { BookWordMes } from "../serve_app/word";
import { TranslateType } from "../serve_app/translation";
import { Button, Chip } from "@nextui-org/react";
import { sotre_state_recite } from "../serve_app/state/state_recite";
import { get_differ_days, get_ymd } from "../tool/time";
import { book_golbal } from "../serve_app/sotre/store_book";
import { Icons } from "../serve_app/icons";

type Props = {
   mes: BookWordMes,
   index: number,//当前复习的地方
   len: number,//单词列表的总长度
   on_show: () => void,//告诉 父组件,要触发展开
}

/// 隐藏单词意思的组件,即未展开状态
const ComReciteHide = ({ mes,index,len, on_show }: Props) => {

   const [star, set_star] = useState(()=>book_golbal.store_golbal.get_star(mes.word));
   useEffect(() => {
      book_golbal.store_golbal.set_star(mes.word, star);
   }, [star]);

   const play_audio = () => {
      sotre_state_recite.get_translation(mes.word).audio.play()
   }

   const Head = () => {
      return (<div className="block w-full h-20  ">
         <div className="flex flex-col w-full h-full text-center">
            {index}/{len}
         </div>
      </div>)
   }
   const Body = () => {
      return (<div className="block w-full">
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial place-content-center place-items-center 
                              w-full h-24 ">
               <span className="text-3xl ">{mes.word}</span>
            </div>
            <div className="flex flex-1 flex-col place-content-center text-2xl px-2">
               <div className="flex flex-initial flex-row gap-x-2   w-full">
                  <Chip startContent={<p>score</p>} variant="flat" classNames={{
                     base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                     content: "drop-shadow shadow-black text-white",
                  }}>{mes.score}</Chip>
                  <Chip startContent={<Icons.HeroiconsOutline.CheckIcon className="h-4 w-4"></Icons.HeroiconsOutline.CheckIcon>}
                     variant="flat">{mes.yes}</Chip>
                  <Chip startContent={<Icons.HeroiconsOutline.XMarkIcon className="h-4 w-4"></Icons.HeroiconsOutline.XMarkIcon>}
                     variant="flat">{mes.no}</Chip>
                  <Chip startContent={<Icons.HeroiconsOutline.ClockIcon className="h-4 w-4"></Icons.HeroiconsOutline.ClockIcon>}
                     variant="flat">{get_differ_days(mes.last_time)}</Chip>

                  
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
               <Button variant="light" color="primary" className="w-[80%] h-[60%] " onPress={on_show}>
                  <Icons.HeroiconsOutline.EyeIcon className="h-8 w-8 text-blue-500"></Icons.HeroiconsOutline.EyeIcon>
               </Button>
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