import { createContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store_book_data } from "../../serve_app/sotre_data/sotre_book_data";
import ComWordList from "../../component/ComWordList";
import { Button } from "antd-mobile";


export const SelectMode = createContext(false);

const PageWatchWordList = () => {
   const navigate = useNavigate();
   const params = useParams();
   const book_name = params['book_name'] as string;// book name
   const [word_list, set_word_list] = useState(() =>
      Object.keys(store_book_data.get_book(book_name).get_all_word_mes())
   )
   // const [b,b_set]=useState(()=>false);
   const [select_mode, set_select_mode] = useState(() => false);
   
   return <div className="w-full h-screen">
      <div className="fixed top-0 right-0">
         <Button onClick={() => set_select_mode(!select_mode)}>{select_mode + ""}</Button>

      </div>
      <SelectMode.Provider value={select_mode}>
         <ComWordList book_name={book_name}
            word_list={word_list}
            on_change_word_list={v => set_word_list(v)}
            on_select={(word_name: string, state: boolean) => {
               console.log(word_name, state);
               
            }}
         ></ComWordList>
      </SelectMode.Provider>


   </div>
}

export default PageWatchWordList