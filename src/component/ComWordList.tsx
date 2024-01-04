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
   // todo : 要解决大量数据渲染列表的性能问题
   //    不能用react-virtualized,因为很难做到局部渲染,第二是它的单行高度不能自动调整
   //    既然虚表都无法调整高度(不美观啦~没办法啦~),那么只能用 分片渲染了
   //    memo

   // const [i, set_i] = useState(-1);
   // const [isPending, startTransition] = useTransition();
   // const i = useRef(word_list.length > 100 ? 100 : word_list.length);
   // const [list, set_list] = useState<string[]>(() => {
   //    const inter_id = setInterval(() => {
   //       console.warn(i.current);
   //       i.current = i.current + 100;
   //       if (i.current > word_list.length) {
   //          i.current = word_list.length;
   //          clearInterval(inter_id);
   //       }
   //       set_list(word_list.slice(0, i.current));
   //    }, 10);
   //    return word_list.slice(0, i.current);
   // });


   // const row = ({
   //    index,
   // }: {
   //    index: number
   // }) => {
   //    const word_name = word_list[index];
   //    console.log(`${index}:${word_name}被渲染`);
   //    const [b, set_b] = useState(false);
   //    return <div className="flex flex-col w-full p-2" onClick={() => {

   //    }}>
   //       <div className="flex">
   //          {word_name}
   //       </div>
   //       <div className="flex ">
   //          {
   //             b ? <pre>a
   //                b
   //                c</pre> : <></>
   //          }
   //       </div>
   //    </div>
   // };
   // const Row = memo(row);

   debug_time.start()
   // 我尼玛!我不是天才谁是天才!完美的列表渲染解决方案
   // 加载1000个7秒,加载4000个70秒, 不知道为什么越后面越慢
   const RowLoop = memo(({
      index,
   }: {
      index: number
   }) => {
      const word_name = word_list[index];
      // console.log(`${index}:${word_name}被渲染`);
      if(index === word_list.length-1){
         console.warn(word_name);
         debug_time.log();
         debug_time.stop();
      }
      if(index%100 == 0){
         debug_time.log(index+"");
      }
      const [b, set_b] = useState(() => {
         setTimeout(() => {
            set_b(true)
         });
         return false
      });
      const [a, set_a] = useState(() =>false);
      return <>
         <div className="flex flex-col w-full p-2" onClick={() => {
            set_a(!a);
         }}>
            <div className="flex">
               {word_name}
            </div>
            <div className="flex">
               {a?"bbb":<></>}
            </div>
         </div>
         {
            index + 1 < word_list.length && b
               ? <RowLoop index={index + 1}></RowLoop>
               : <></>
         }
      </>
   })


   return <div className="flex flex-col w-full h-full">
      {/* {
         list.map((v, index) => {
            return <Row key={index} index={index}></Row>
         })
      } */}
      <RowLoop index={0}></RowLoop>
   </div>
}


export default ComWordList;