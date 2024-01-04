import { Accordion, AccordionItem } from "@nextui-org/react";

import { CSSProperties, ReactNode, useState } from "react";
import { List as VirtualizedList } from 'react-virtualized/dist/es/List'
import AutoSizer from "react-virtualized/dist/es/AutoSizer";
import { List } from "antd-mobile";
import { FixedSizeList } from "react-window";
/// 安心在这个页面 尝试和测试 玩意八
const PageDebug = () => {



   return <div className="w-full h-screen">
      <AutoSizer>
         {({ width, height }) => (
            <FixedSizeList
               height={height}
               width={width}
               itemCount={1000}
               itemSize={35}
            >
               {({
                  index,
                  style,
               }: {
                  index: number
                  style: CSSProperties
               }) => {
                  const [a,set_a] = useState(0);
                  return <pre style={{...style}} className="text-blue-400 bg-slate-300 whitespace-pre-wrap"
                     onClick={()=>set_a(a+1)}>
                     {index+a+"\n 123"}
                  </pre>
               }}
            </FixedSizeList>
         )}
      </AutoSizer>
   </div>
}

export default PageDebug