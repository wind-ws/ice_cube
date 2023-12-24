import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { store_book_data } from "../../serve_app/sotre_data/sotre_book_data";
import { store_filter } from "../../serve_app/sotre_data/sotre_filter";
import { useState } from "react";
import { store_recite_state } from "../../serve_app/store_state/sotre_recite_state";
import { Option } from "../../tool/option";



const PageRecite = () => {
   const navigate = useNavigate();



   const Prepare = () => {
      const book_list = store_book_data.get_all_book_name();
      const filter_list = store_filter.get_all_filter_name();
      (store_recite_state.value.value.book_name ).unwrap();
      const [select_book,set_select_book] = useState<string|undefined>(()=>"")

      const review = () => {

      }
      const continue_review = () => {

      }

      const Head = () => {
         return <div className="flex flex-initial h-36 bg-green-100">

         </div>
      }
      const Body = () => {
         return <div className="flex flex-1 flex-col  h-full w-full">
            <Select
               label="选择将要复习的单词本"
               selectionMode="single"
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