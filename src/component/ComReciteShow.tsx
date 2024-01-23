import { Button, Chip, Textarea } from "@nextui-org/react"
import { BookWordMes, score_add as _score_add, score_subtract, set_first_time } from "../serve_app/word"
import { get_differ_days, get_ymd, now } from "../tool/time"
import { useEffect, useRef, useState } from "react"
import { Icons } from "../serve_app/icons"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { TranslateType } from "../serve_app/translation"
import { store_word_golbal } from "../serve_app/sotre_data/store_word_golbal"
import { none, some } from "../tool/option"
import { store_recite_state } from "../serve_app/store_state/sotre_recite_state"
import { Option } from "../tool/option"
import { ProgressBar, Toast } from "antd-mobile"
import { store_book_data } from "../serve_app/sotre_data/sotre_book_data"
import { store_setting } from "../serve_app/sotre_data/sotre_setting"
import ComModalReciteSetting from "./ComModalReciteSetting"

type Props = {
   book_name: string,
   word_name: string,
   // mes: BookWordMes,
   // translations:TranslateType,//翻译结果
   index: number,//当前复习的地方
   len: number,//单词列表的总长度
   // yes_no(score: number): void,//if yes , score 必须为正数, if no, score 必须负数
   on_next_word: () => void,//告诉 父组件,要触发 获取下一个单词
}

const ComReciteShow = ({ book_name, word_name, index, len, on_next_word }: Props) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [word_mes, set_word_mes] = useState(() => store_book_data.get_book(book_name).get_mes(word_name))
   const [star, set_star] = useState(() => store_word_golbal.get_star(word_name));
   useEffect(() => {
      if (store_word_golbal.value.value[word_name].star != star)
         store_word_golbal.set_star(word_name, star);
   }, [star]);
   const [note, set_note] = useState(() => store_word_golbal.get_note(word_name));
   useEffect(() => {
      if (store_word_golbal.value.value[word_name].note != note)
         store_word_golbal.set_note(word_name, note);
   }, [note]);

   const [score_sub, set_score_sub] = useState(() => score_subtract(word_mes.score));
   const [score_add, set_score_add] = useState(() => _score_add(word_mes.score));

   const [translation, set_translation] = useState<Option<TranslateType>>(() => {
      const a = store_recite_state.get_translation(word_name);
      if (a.is_none()) {
         const inter_id = setInterval(() => {
            store_recite_state.get_translation(word_name).match((v) => {//直到可以获取翻译为止
               clearInterval(inter_id);
               set_translation(some(v));
            }, () => { })
         }, 100);
      }
      return a;
   });

   const yes_no = (score: number) => {
      const book = store_book_data.get_book(book_name);
      book.set_word_time(word_name, now());
      book.set_word_score(word_name, word_mes.score + score);
      book.set_word_first_time(word_name);
      if (score < 0) {
         book.plus_word_no(word_name)
      } else {
         book.plus_word_no(word_name)
      }
      on_next_word();
   }



   const play_audio = () => {
      translation.match((v) => {
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
      const delete_word = () => {
         store_book_data.get_book(book_name).delete_word(word_mes.word);
         Toast.show("删除成功");
         on_next_word();
      }
      return (<div className="block w-full h-20  ">
         <div className="flex flex-1 flex-col w-full h-full ">
            <div className="flex pl-4 w-full">
               <ProgressBar className="w-full"
                  percent={Math.floor((index / len) * 100)}
                  text={`${index}/${len}`}
               />
            </div>
            <div className="flex flex-row gap-x-3 px-4 mt-2 flex-initial items-center justify-end w-full ">
               <Icons.HeroiconsOutline.TrashIcon onClick={delete_word} className="h-6 text-red-400" />

               <Icons.HeroiconsOutline.Cog6ToothIcon onClick={onOpen} className="h-7 text-slate-400" />

            </div>
         </div>
         <ComModalReciteSetting placement={"bottom-center"} isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>)
   }
   const Body = () => {
      return (<div className="block w-full">
         <div className="flex flex-col w-full h-full">
            <div className="  flex flex-initial place-content-center place-items-center 
                              w-full h-24 ">
               <span className="text-3xl">{word_name}</span>
            </div>
            <div className="flex flex-1 flex-col place-content-center text-2xl px-2">
               <div className="flex flex-initial flex-row gap-x-2 w-full mb-3">
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
                  {
                     translation.match(v => v.means.map(v => <div key={v.part}
                        className="text-base my-1">
                        <span className="text-slate-400">{v.part + " "}</span>
                        {v.means.join('')}
                     </div>),
                        () => [<p>等待翻译加载...</p>])
                  }
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
               <div className="flex justify-center items-center gap-x-2 w-[40%] h-[60%] text-rose-500
                  active:bg-rose-100 rounded-lg"
                  onClick={() => yes_no(-score_sub)}>
                  <Icons.HeroiconsOutline.ArrowTrendingDownIcon className="h-[32px]"></Icons.HeroiconsOutline.ArrowTrendingDownIcon>
                  {score_sub}
               </div>
               <div className="flex justify-center items-center gap-x-2 w-[40%] h-[60%] text-green-500
                  active:bg-green-100 rounded-lg"
                  onClick={() => yes_no(score_sub)}>
                  <Icons.HeroiconsOutline.ArrowTrendingUpIcon className="h-[32px]"></Icons.HeroiconsOutline.ArrowTrendingUpIcon>
                  {score_add}
               </div>
            </div>
         </div>
      </div>)
   }
   const MyModal = () => {
      return <Modal backdrop={"blur"} placement={"center"} isOpen={isOpen} onClose={onClose}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">编辑{word_name}的笔记</ModalHeader>
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