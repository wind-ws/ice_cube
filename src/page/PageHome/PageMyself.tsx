import { Button } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { useEffect, useState, useRef } from "react";
import ComBookCard from "../../component/ComBookCard";

const PageMyself = () => {
   const [keys, set_keys] = useState<string[]>([]);
   const ref = useRef(true);// 阻断无限渲染循环
   if (ref.current) {
      book_data.get_book_keys()
         .then((keys) => {
            ref.current = false
            set_keys(keys)
         })
   }


   return (
      <>
         <Button onPress={() => {
            book_data.store_books.creat_book("我操!这是一个超jb长的名字啊啊啊啊啊啊啊啊啊啊啊啊!");
         }} >new a book</Button>
         <div>
            {
               keys.map((key, index) =><ComBookCard key={index} keys={keys} index={index} ></ComBookCard>)
            }
            

         </div>
      </>
   )
}
export default PageMyself;