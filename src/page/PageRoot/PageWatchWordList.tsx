import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store_book_data } from "../../serve_app/sotre_data/sotre_book_data";
import ComWordList from "../../component/ComWordList";


const PageWatchWordList = () => {
   const navigate = useNavigate();
   const params = useParams();
   const book_name = params['book_name'] as string;// book name
   
   const [word_list, set_word_list] = useState(() =>
      Object.keys(store_book_data.get_book(book_name).get_all_word_mes())
   )

   return <div className="w-full h-screen">
      <ComWordList book_name={book_name}
         word_list={word_list}
         on_change_word_list={v=>set_word_list(v)}></ComWordList>
   </div>
}

export default PageWatchWordList