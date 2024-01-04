import { Accordion, AccordionItem } from "@nextui-org/react";
import { CSSProperties, ReactNode, memo, useCallback, useRef, useState, useTransition } from "react";
import { List } from "antd-mobile";
import { store_translation_buffer } from "../serve_app/sotre_data/store_translation_buffer";
import { FixedSizeList, VariableSizeList } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer";
import { debug_time } from "../tool/debug";

type Props = {
   book_name: string,
   word_list: string[],
   on_change_word_list(word_list: string[]): void,

}


const ComWordList = ({ book_name, word_list, on_change_word_list }: Props) => {
   // 已解决(不要删除注释,万一当前解决方案有问题,重新开始可以少走点弯路) : 要解决大量数据渲染列表的性能问题
   //    不能用react-virtualized,因为很难做到局部渲染,第二是它的单行高度不能自动调整
   //    既然虚表都无法调整高度(不美观啦~没办法啦~),那么只能用 分片渲染了
   //    memo


   // 我尼玛!我不是天才谁是天才!完美的列表渲染解决方案
   const RowLoop = memo(({
      index,
   }: {
      index: number
   }) => {
      const [b, set_b] = useState(() => {//用于控制是否立马渲染下一个列表
         const t = 200; // t越高渲染的越快,不建议高于500,不然可能会导致初始加载出现一点点卡顿
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
         const [a, set_a] = useState(() => false);
         console.log(`${index}:${word_name}被渲染`);

         return <div className="flex flex-col w-full p-2" onClick={() => {
            set_a(!a);
         }}>
            <div className="flex">
               {word_name}
            </div>
            <div className="flex">
               {a ? "bbb" : <></>}
            </div>
         </div>
      })
      return <>
         <Row index={index}></Row>
         {
            index + 1 < word_list.length && b
               ? <RowLoop index={index + 1}></RowLoop>
               : <></>
         }
      </>
   })


   return <div className="flex flex-col w-full h-full">
      <RowLoop index={0}></RowLoop>
   </div>
}


export default ComWordList;