import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import ComBookCard from "../../../component/ComBookCard";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { fetch } from '@tauri-apps/plugin-http';
import { store_book_data } from "../../../serve_app/sotre_data/sotre_book_data";
import { store_filter } from "../../../serve_app/sotre_data/sotre_filter";
import ComFilterCard from "../../../component/ComFilterCard";

const PageMyself = () => {
   const navigate = useNavigate();

   const FilterCardList = () => {
      const [filter_name_list,set_filter_name_list] = useState(store_filter.get_all_filter_name());
      const to_create_filter = ()=>{
         navigate("/create_filter");
      }
      return <div className="flex justify-around  gap-y-5 flex-wrap items-stretch w-full ">
         {
            filter_name_list.map(filter_name=><div className="flex  w-[45%]" key={filter_name}>
               <ComFilterCard key={filter_name} filter_name={filter_name} 
                  on_delete_filter={()=>set_filter_name_list(store_filter.get_all_filter_name())}></ComFilterCard>
            </div>)
         }
         <div className="flex  items-center justify-center w-[45%] h-auto min-h-[65px]
            rounded-xl bg-white text-base 
            border-1 border-slate-200"
            onClick={to_create_filter}>
            创建过滤器
         </div>
      </div>
   }
   const BookCardList = () => {
      const [book_name_list,set_book_name_list] = useState(store_book_data.get_all_book_name());
      const to_create_book = ()=>{
         navigate("/create_book")
      }
      return <div className="flex gap-y-5 flex-wrap w-full ">
         {
            book_name_list.map(book_name => <div className="flex w-[45%] m-auto" key={book_name}>
               <ComBookCard key={book_name} book_name={book_name} 
                  on_delete_book={()=>set_book_name_list(store_book_data.get_all_book_name())}></ComBookCard>
            </div>
            )
         }
         <div className="flex  items-center justify-center w-[45%] h-auto min-h-[65px]
            rounded-xl  text-base m-auto
            border-1 border-slate-200"
            onClick={to_create_book}>
            创建单词本
         </div>
      </div>
   }
   return (
      <div className="flex flex-col h-full w-full px-2 pt-2">
         <div className="flex flex-initial  w-full ">
            <FilterCardList></FilterCardList>
         </div>
         <Divider className="my-4" />
         <div className="flex flex-initial  w-full ">
            <BookCardList></BookCardList>
         </div>
      </div>
   )
}
export default PageMyself;