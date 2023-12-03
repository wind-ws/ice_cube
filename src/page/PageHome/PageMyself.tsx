import { Button } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { useEffect, useState, useRef } from "react";
import ComBookCard from "../../component/ComBookCard";

const PageMyself = () => {
   const [names, _] = useState<string[]>(book_data.store_books.get_all_book_name());


   return (
      <>
         <Button onPress={() => {
            book_data.store_books.creat_book("0123456789abcdefghijklmnopqrstuvwxyz");
         }} >new a book</Button>
         <div>
            {
               names.map((name, index) =><ComBookCard key={name} names={names} index={index} ></ComBookCard>)
            }

         </div>
      </>
   )
}
export default PageMyself;