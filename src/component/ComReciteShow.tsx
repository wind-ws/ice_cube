import { Button, Chip, Textarea } from "@nextui-org/react"
import { book_golbal } from "../serve_app/sotre/store_book"
import { BookWordMes, score_add as _score_add, score_subtract } from "../serve_app/word"
import { sotre_state_recite } from "../serve_app/state/state_recite"
import { get_differ_days, get_ymd } from "../tool/time"
import { useEffect, useRef, useState } from "react"
import { Icons } from "../serve_app/icons"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { TranslateType } from "../serve_app/translation"


type Props = {
   mes: BookWordMes,
   index: number,//当前复习的地方
   len: number,//单词列表的总长度
   translations: TranslateType,//翻译结果
   yes_no(score: number): void,//if yes , score 必须为正数, if no, score 必须负数
}

const ComReciteShow = ({ mes,index,len,translations, yes_no }: Props) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [star, set_star] = useState(() => book_golbal.store_golbal.get_star(mes.word));
   useEffect(() => {
      book_golbal.store_golbal.set_star(mes.word, star);
   }, [star]);
   const [note, set_note] = useState(() => book_golbal.store_golbal.get_note(mes.word));
   useEffect(() => {
      book_golbal.store_golbal.set_note(mes.word,note);
   }, [note]);
   
   const [score_sub, set_score_sub] = useState(() => score_subtract(mes.score));
   const [score_add, set_score_add] = useState(() => _score_add(mes.score));


   const play_audio = () => {
      translations.audio.play()
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
               <span className="text-3xl">{mes.word}</span>
            </div>
            <div className="flex flex-1 flex-col place-content-center text-2xl px-2">
               <div className="flex flex-initial flex-row gap-x-2 w-full mb-3">
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
                  {translations.paraphrase}
               </div>
               <div className="flex flex-1 flex-col w-full ">
                  <div className="flex w-full min-h-[60%] bg-slate-200 rounded-md border-2 border-slate-400 p-2"
                     onDoubleClick={() => {
                        onOpen()
                     }}>
                     {
                        note == "" ?
                           <div className="flex w-full h-full justify-center items-center text-slate-400">双击输入笔记</div>
                           :
                           <div className="block w-full h-full 
                              whitespace-pre-wrap break-all overflow-scroll text-xl">
                              {note}
                           </div>
                     }
                  </div>
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
               <Button variant="light" color="danger" className="w-[40%] h-[60%]" onPress={() => yes_no(-score_sub)}>
                  <Icons.HeroiconsOutline.ArrowTrendingDownIcon></Icons.HeroiconsOutline.ArrowTrendingDownIcon>
                  {score_sub}
               </Button>
               <Button variant="light" color="success" className="w-[40%] h-[60%]" onPress={() => yes_no(score_add)} >
                  <Icons.HeroiconsOutline.ArrowTrendingUpIcon></Icons.HeroiconsOutline.ArrowTrendingUpIcon>
                  {score_add}
               </Button>
            </div>
         </div>
      </div>)
   }
   const MyModal = () => {
      return <Modal backdrop={"blur"} placement={"center"} isOpen={isOpen} onClose={onClose}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">编辑{mes.word}的笔记</ModalHeader>
                  <ModalBody>
                     <Textarea
                        value={note}
                        onValueChange={set_note}
                        placeholder="Enter your description"
                        className="w-full"
                     />
                  </ModalBody>
                  <ModalFooter>
                     <Button color="danger" variant="light" onPress={onClose}>
                        Close
                     </Button>
                     <Button isDisabled color="success" onPress={onClose}>
                        Save
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   }
   return (<div className="w-full h-full  bg-slate-100" style={{ height: "100vh" }}>
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
      <MyModal></MyModal>
   </div>)
}

export default ComReciteShow