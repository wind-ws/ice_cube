import { Button, Chip } from "@nextui-org/react"
import { book_golbal } from "../tool/sotre/store_book"
import { BookWordMes, score_add as _score_add, score_subtract } from "../tool/word"
import { sotre_state_recite } from "../tool/state/state_recite"
import { get_differ_days, get_ymd } from "../tool/time"
import { useEffect, useRef, useState } from "react"
import { Icons } from "../tool/icons"

type Props = {
   mes: BookWordMes,
   yes(score: number): void,
   no(score: number): void
}

const ComReciteShow = ({ mes, yes, no }: Props) => {
   const [star, set_star] = useState(() => book_golbal.store_golbal.get_star(mes.word));
   useEffect(() => {
      book_golbal.store_golbal.set_star(mes.word, star);
   }, [star]);
   const [note, set_note] = useState(() => book_golbal.store_golbal.get_note(mes.word));
   const [score_sub, set_score_sub] = useState(() => score_subtract(mes.score));
   const [score_add, set_score_add] = useState(() => _score_add(mes.score));


   const play_audio = () => {
      sotre_state_recite.get_translation(mes.word).audio.play()
   }
   const Head = () => {
      return (<div className="block w-full h-20  ">

      </div>)
   }
   const Body = () => {
      return (<div className="block w-full">
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial place-content-center place-items-center 
                              w-full h-24 ">
               <span className="text-3xl">{mes.word}</span>
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
                  <p className="flex place-content-center w-full">|笔记|</p>
                  <span className="block w-full h-full px-5 overflow-auto whitespace-normal break-words truncate  ">
                     { }
                  </span>
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
            <div className="flex flex-1 place-items-center justify-between w-full h-14 px-[3em] ">
               <Button variant="light" color="danger" className="w-[40%] h-[60%]" onPress={() => no(score_sub)}>
                  <Icons.HeroiconsOutline.ArrowTrendingDownIcon></Icons.HeroiconsOutline.ArrowTrendingDownIcon>
                  {score_sub}
               </Button>
               <Button variant="light" color="success" className="w-[40%] h-[60%]" onPress={() => yes(score_add)} >
                  <Icons.HeroiconsOutline.ArrowTrendingUpIcon></Icons.HeroiconsOutline.ArrowTrendingUpIcon>
                  {score_add}
               </Button>
            </div>
         </div>
      </div>)
   }
   return (<div className="w-full h-full  bg-slate-200" style={{ height: "100vh" }}>
      <div className="flex flex-col" style={{ height: "100vh" }}>
         <div className="flex flex-initial w-full h-20 ">
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

export default ComReciteShow