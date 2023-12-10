import { useRef, useState } from "react"
import { BookWordMes } from "../tool/word";
import { TranslateType } from "../tool/translation";
import { Button } from "@nextui-org/react";
import { sotre_state_recite } from "../tool/state/state_recite";
import { get_ymd } from "../tool/time";
import { book_golbal } from "../tool/sotre/store_book";


type Props = {
   mes: BookWordMes,
   on_show: () => void,//告诉 父组件,要触发展开
}

/// 隐藏单词意思的组件,即未展开状态
const ComReciteHide = ({ mes, on_show }: Props) => {
   
   const play_audio = ()=>{
      sotre_state_recite.get_translation(mes.word).audio.play()
   }
   
   const Head = () => {
      return (<div className="block w-full h-20 bg-cyan-200 ">

      </div>)
   }
   const Body = () => {
      return (<div className="block w-full">
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial place-content-center place-items-center 
                              w-full h-24 bg-rose-300">
               <span className="text-2xl ">{mes.word}</span>
            </div>
            <div className="flex flex-1 flex-col place-content-center text-2xl">
               <div className="flex flex-initial flex-col  w-full">
                  <p className="flex place-content-center " >分数:{mes.score}</p>
                  <p className="flex place-content-center " >正确次数:{mes.yes}</p>
                  <p className="flex place-content-center " >错误次数:{mes.no}</p>
                  <p className="flex place-content-center " >上次遇到:{get_ymd(mes.last_time)}</p>
               </div>
               <div className="flex flex-1 flex-col w-full">
                  <p className="flex place-content-center w-full">|笔记|</p>
                  <span className="block w-full h-full px-5 overflow-auto whitespace-normal break-words truncate  ">
                     {book_golbal.store_golbal.get_note(mes.word)}
                  </span>
               </div>
            </div>
         </div>
      </div>)
   }
   const Foot = () => {
      return (<div className="block w-full h-48 bg-green-300">
         {/* <Button onPress={()=>{sotre_state_recite.get_translation(mes.word).audio.play()}}>发音</Button> */}
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial justify-between place-items-center 
                              w-full h-24 px-2 bg-indigo-400">
               <Button className="h-[60%]" onPress={play_audio}>发音</Button>
               <Button className="h-[60%]">star</Button>
               <Button className="h-[60%]">star</Button>
               <Button className="h-[60%]" onPress={play_audio}>发音</Button>
            </div>
            <div className="flex flex-1 place-content-center place-items-center w-full h-14 bg-green-400">
               <Button className="w-[80%] h-[60%]" onPress={on_show}>展开</Button>
            </div>
         </div>
      </div>)
   }
   return (<div className="w-full h-full bg-slate-300" style={{ height: "100vh" }}>
      <div className="flex flex-col" style={{ height: "100vh" }}>
         <div className="flex flex-initial w-full h-20 bg-cyan-200 ">
            <Head></Head>
         </div>
         <div className="flex flex-1">
            <Body></Body>
         </div>
         <div className="flex flex-initial w-full h-48 bg-green-300">
            <Foot></Foot>
         </div>
      </div>
   </div>)
}

export default ComReciteHide