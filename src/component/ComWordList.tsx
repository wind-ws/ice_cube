import { Accordion, AccordionItem } from "@nextui-org/react";
import { CSSProperties, ReactNode, memo, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import { List } from "antd-mobile";
import { store_translation_buffer } from "../serve_app/sotre_data/store_translation_buffer";
import { FixedSizeList, VariableSizeList } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer";
import { debug_time } from "../tool/debug";
import { Icons } from "../serve_app/icons";
import { store_word_golbal } from "../serve_app/sotre_data/store_word_golbal";
import { SelectMode } from "../page/PageRoot/PageWatchWordList";

type Props = {
   book_name: string,
   word_list: string[],
   on_change_word_list(word_list: string[]): void,

   // select_mode: boolean,
   /// state=true 表示选择,false表示不选择
   on_select(word_name: string,state:boolean): void
}


const ComWordList = ({
   book_name,
   word_list,
   on_change_word_list,
   on_select
}: Props) => {
   // 已解决(不要删除注释,万一当前解决方案有问题,重新开始可以少走点弯路) : 要解决大量数据渲染列表的性能问题
   //    不能用react-virtualized,因为很难做到局部渲染,第二是它的单行高度不能自动调整
   //    既然虚表都无法调整高度(不美观啦~没办法啦~),那么只能用 分片渲染了
   //    memo


   // 我尼玛!我不是天才谁是天才!完美的列表渲染解决方案
   // ! : 当渲染的列表7000个左右时, 返回到 上一个页面 会发生错误(不知道为什么...)
   // ! : 好像是 7000个渲染完后才会发生这个错误
   // ! : 渲染2000行后退出就会出现错误
   // 虽然我也不清楚为什么,加上useCallback就好了
   //    好像是因为js递归会创建啥函数上下文,而useCallback可以缓存函数啥啥的...
   //    错误是因为递归导致的爆堆栈,这个缓存可能会让它不会爆吧
   //    虽然蒙对了,但是 总而言之,天才!
   const RowLoop = useCallback(memo(({
      index,
   }: {
      index: number,
   }) => {
      if (index == word_list.length) {
         console.warn("done");
         return <></>
      }
      const [b, set_b] = useState(() => {//用于控制是否立马渲染下一个列表
         const t = 400; // t越高渲染的越快,不建议高于500,不然可能会导致初始加载出现一点点卡顿
         if (index % t != 0) {//我尼玛!我天才!!神级优化! 2秒渲染完7000个列表
            return true
         }
         setTimeout(() => {//用于停止渲染后再加载渲染,这样的异步控制可以让 页面快速渲染出来,后面的列表再慢慢渲染
            set_b(true)
         });
         return false
      });
      const Row = memo(({//这个memo是为了防止b变化时重新渲染一次列表内容
         index,
      }: {
         index: number
      }) => {
         const word_name = word_list[index];
         // console.log(`${index}:${word_name}被渲染`);

         const [show, set_show] = useState(() => false);
         // const [star, set_star] = useState(() => store_word_golbal.get_star(word_name));
         // useEffect(()=>{
         //    store_word_golbal.set_star(word_name, star);
         // },[star]);
         const Select = memo(() => {
            const select_mode = useContext(SelectMode);
            const [select, set_select] = useState(()=>false);
            
            return <div className="flex h-full w-full"
               onClick={() => {
                  if(select_mode){
                     on_select(word_name,!select);
                     set_select(!select);
                  }
               }}>
               {
                  select_mode
                     ? select
                        ? <Icons.HeroiconsSolid.StopIcon className=" text-teal-400" />
                        : <Icons.HeroiconsOutline.StopIcon className=" text-slate-300 " />
                     : <></>
               }

            </div>
         });
         return <div className="flex  w-full border-b-1 p-2">
            <div className="flex w-10  h-8">
               <Select></Select>
            </div>
            <div className="flex flex-col w-full"
               onClick={() => {
                  if (!show) {
                     store_translation_buffer
                        .get_translation(word_name)
                        .match(v => v.audio.play(), () => null);
                  }
                  set_show(!show);
               }}>
               <div className="flex justify-between items-center w-full h-8">
                  <div className="flex text-base font-medium w-full ">
                     {word_name}
                  </div>
                  {/* <div className="flex h-[70%]"
                     onClick={()=>set_star(!star)}>
                     {
                        star
                           ? <Icons.HeroiconsMiniSolid.StarIcon className=" text-yellow-200 h-full" />
                           : <Icons.HeroiconsOutline.StarIcon className="text-slate-300 h-full" />
                     }

                  </div> */}
               </div>
               {
                  show
                     ? <div className="flex ">
                        {store_translation_buffer
                           .get_translation(word_name)
                           .match(v => {
                              return <div className="flex flex-col">
                                 {v.means.map(v => <div key={v.part} className="flex">
                                    <span className=" text-slate-500">{v.part}</span>
                                    <span>{v.means.join(" ")}</span>
                                 </div>)}
                              </div>
                           }, () => <p>等待翻译加载</p>)}
                     </div>
                     : <></>
               }

            </div>

         </div>
      })
      return <>
         <Row index={index}></Row>
         {
            b
               ? <RowLoop index={index + 1}></RowLoop>
               : <></>
         }
      </>
   }), [])


   return <div className="flex flex-col w-full h-full">
      <RowLoop index={0} ></RowLoop>
   </div>
}


export default ComWordList;