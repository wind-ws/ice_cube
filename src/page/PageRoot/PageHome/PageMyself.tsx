import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import ComBookCard from "../../../component/ComBookCard";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { translate_text_url } from "../../../serve_app/translation";
import { fetch } from '@tauri-apps/plugin-http';
import { store_book_data } from "../../../serve_app/sotre_data/sotre_book_data";

const PageMyself = () => {
   const navigate = useNavigate();

   const FilterCardList = () => {
      return <div>

      </div>
   }
   const BookCardList = () => {
      const book_name_list = store_book_data.get_all_book_name();
      const to_create_book = ()=>{
         navigate("/create_book")
      }
      return <div className="flex  gap-4 flex-wrap w-full ">
         {
            book_name_list.map(book_name => <div className="w-[45%]" key={book_name}>
               <ComBookCard key={book_name} book_name={book_name}></ComBookCard>
            </div>
            )
         }
         <div className="flex  items-center justify-center w-[45%] h-auto min-h-[65px]
            rounded-xl bg-white text-base
            border-1 border-slate-200"
            onClick={to_create_book}>
            创建单词本
         </div>
      </div>
   }
   return (
      <div className="flex flex-col h-full w-full px-2 pt-2">
         <div className="flex flex-initial  w-full bg-rose-300">
            <FilterCardList></FilterCardList>
         </div>
         <div className="flex flex-initial  w-full bg-amber-100">
            <BookCardList></BookCardList>
         </div>
      </div>
   )
}
export default PageMyself;