import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { store_book_data } from "../../serve_app/sotre_data/sotre_book_data";
import { store_filter } from "../../serve_app/sotre_data/sotre_filter";
import { useEffect, useState } from "react";
import { store_recite_state } from "../../serve_app/store_state/sotre_recite_state";
import { Option, none, some } from "../../tool/option";
import { Toast } from "antd-mobile";
import { todo } from "../../tool/auxiliary_fn";



const PageRecite = () => {
   const navigate = useNavigate();



   const Prepare = () => {
      const book_list = store_book_data.get_all_book_name();
      const filter_list = store_filter.get_all_filter_name();


      const [select_book, set_select_book] = useState<string[]>(
         () => store_recite_state.value.value.book_name.match(v => [v], () => []))

      const [select_filter, set_select_filter] = useState<string[]>(
         () => store_recite_state.value.value.filters)


      const review = () => {
         if (select_book.length == 1) {
            store_recite_state.over_load(select_book[0], select_filter
               .map(v => store_filter.get_filter(v).unwrap()))
            store_recite_state.value.value.book_name = Option.from_undefined(select_book[0]);
            store_recite_state.value.value.filters = select_filter;
            todo()
         } else {
            Toast.show("请选择单词本");
         }
      }
      const continue_review = () => {
         store_recite_state.load();
         todo()
      }

      const Head = () => {
         return <div className="flex flex-initial h-36 ">

         </div>
      }
      const Body = () => {
         return <div className="flex flex-1 flex-col  h-full w-full">
            <Select
               label="选择将要复习的单词本"
               selectionMode="single"
               selectedKeys={select_book}
               onSelectionChange={v => set_select_book(Array.from(v).map(v => v.toString()))}
               className="w-[80%] self-center"
            >
               {book_list.map((book_name) => (
                  <SelectItem key={book_name} value={book_name} >
                     {book_name}
                  </SelectItem>
               ))}
            </Select>

            <Select
               label="选择将要使用的过滤器"
               selectionMode="multiple"
               selectedKeys={select_filter}
               onSelectionChange={v => set_select_filter(Array.from(v).map(v => v.toString()))}
               className="w-[80%] self-center pt-4"
            >
               {filter_list.map((book_name) => (
                  <SelectItem key={book_name} value={book_name} >
                     {book_name}
                  </SelectItem>
               ))}
            </Select>
         </div>
      }
      const Foot = () => {
         return <div className="flex flex-initial items-center justify-center gap-x-2 h-24 bg-rose-300">
            <div className="flex items-center justify-center
               rounded-md border-2 border-stone-300
               transition-all
               bg-slate-100 active:bg-blue-100 
               w-[40%] active:w-[38%]
               h-[40%] active:h-[38%]"
               onClick={review}>
               重新开始
            </div>
            <div className="flex items-center justify-center
               rounded-md border-2 border-stone-300
               transition-all
               bg-slate-100 active:bg-blue-100 
               w-[40%] active:w-[38%]
               h-[40%] active:h-[38%]"
               onClick={continue_review}>
               继续复习
            </div>
         </div>
      }
      return <div className="flex flex-col w-full h-screen">
         <Head></Head>
         <Body></Body>
         <Foot></Foot>
      </div>
   }

   return (
      <div className="w-full h-screen">
         <Prepare></Prepare>
      </div>
   )
}

export default PageRecite;