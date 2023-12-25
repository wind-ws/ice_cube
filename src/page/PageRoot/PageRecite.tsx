import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { store_book_data } from "../../serve_app/sotre_data/sotre_book_data";
import { store_filter } from "../../serve_app/sotre_data/sotre_filter";
import { useEffect, useRef, useState } from "react";
import { store_recite_state } from "../../serve_app/store_state/sotre_recite_state";
import { Option, none, some } from "../../tool/option";
import { Toast } from "antd-mobile";
import { todo } from "../../tool/auxiliary_fn";
import { BookWordMes, default_book_word_mes } from "../../serve_app/word";
import { TranslateType } from "../../serve_app/translation";
import { debug_time } from "../../tool/debug";



const PageRecite = () => {
   const navigate = useNavigate();
   const [prepare, set_prepare] = useState(() => true);//true:准备阶段,false开始复习
   const word = useRef<Option<BookWordMes>>(none());
   const translation = useRef<Option<TranslateType>>(none());

   const Prepare = () => {
      const book_list = store_book_data.get_all_book_name();
      const filter_list = store_filter.get_all_filter_name();


      const [select_book, set_select_book] = useState<string[]>(
         () => store_recite_state.value.value.book_name.match(v => [v], () => []))

      const [select_filter, set_select_filter] = useState<string[]>(
         () => store_recite_state.value.value.filters)


      const review = () => {
         if (select_book.length == 1) {
            store_recite_state.value.auto_set_off();
            store_recite_state.value.value.book_name = Option.from_undefined(select_book[0]);
            store_recite_state.value.value.filters = select_filter;
            store_recite_state.over_load(select_book[0], select_filter
               .map(v => store_filter.get_filter(v).unwrap()));
            store_recite_state.value.save()
            debug_time.init();
            debug_time.start();
            store_recite_state.get_current_word().then(v => {
               if (v.is_ok()) {
                  if (v.unwrap().is_none()) {
                     Toast.show("将要背诵的单词列表是空的(可能是筛选过度的原因)");
                  } else {//说明还可以取到下一个单词
                     word.current = some(v.unwrap().unwrap()[0]);
                     translation.current = some(v.unwrap().unwrap()[1]);
                     debug_time.log()
                     debug_time.stop();
                     set_prepare(false);
                  }
               }
            })
            store_recite_state.value.auto_set_default();
         } else {
            Toast.show("请选择单词本");
         }
      }
      const continue_review = () => {
         store_recite_state.value.value.book_name.match((v) => {
            store_recite_state.get_current_word().then(v => {
               if (v.is_ok()) {
                  if (v.unwrap().is_none()) {
                     Toast.show("已经复习完成,后面没有单词啦");
                  } else {//说明还可以取到下一个单词
                     store_recite_state.load();
                     word.current = some(v.unwrap().unwrap()[0]);
                     translation.current = some(v.unwrap().unwrap()[1]);
                     set_prepare(false);
                  }
               }
            })
         }, () => {
            Toast.show("没有记录,无法继续复习");
         })

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
         return <div className="flex flex-initial items-center justify-center gap-x-2 h-24 ">
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

   const Going = () => {
      const [show, set_show] = useState(false);


      return <div className="w-full h-full">
         asd
      </div>
   }

   return (
      <div className="w-full h-screen">
         {
            prepare ? <Prepare></Prepare> : <Going></Going>
         }
      </div>
   )
}

export default PageRecite;