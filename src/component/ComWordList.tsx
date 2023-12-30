import { Accordion, AccordionItem } from "@nextui-org/react";
import { useCallback } from "react";


type Props = {
   book_name: string,
   word_list: string[],
   on_change_word_list(word_list: string[]): void,

}


const ComWordList = ({ book_name, word_list, on_change_word_list }: Props) => {
   // todo : 要解决大量数据渲染列表的性能问题
   //    使用 useCallback 和 一次只渲染部分列表
   const list = useCallback(()=>word_list,[word_list]) 
   
   return <div className="flex ">
      <Accordion selectionMode="multiple"
         className="flex  flex-col "
         itemClasses={{}}
         >
         {
            list().map(word => <AccordionItem
               classNames={{base:"base-classes"}}
               key={word}
               subtitle={
                  <div>

                  </div>
               }
               title={word}
            >
               {word}
            </AccordionItem>)
         }
      </Accordion>
   </div>
}


export default ComWordList;