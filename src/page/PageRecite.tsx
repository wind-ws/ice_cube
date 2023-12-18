import { startTransition, useEffect, useRef, useState } from "react";
import ComReciteHide from "../component/ComReciteHide";
import {  sotre_state_recite } from "../tool/state/state_recite";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { store_filter } from "../tool/filter";
import { BookWordMes } from "../tool/word";
import { TranslateType } from "../tool/translation";
import ComReciteShow from "../component/ComReciteShow";
import { book_data } from "../tool/sotre/store_book";




const PageRecite = () => {
   const navigate = useNavigate();
   if (sotre_state_recite.value.value.book_name == undefined) {
      navigate("/home/gate");
   }
   const book = book_data.store_books.value[sotre_state_recite.value.value.book_name as string];
   const b = useRef(true);
   const word = useRef<BookWordMes | "over">("over");
   const [is_show, set_is_show] = useState(false);

   if (b.current) {
      word.current = sotre_state_recite.next_word();//初始化单词
      b.current = false
   }
   const set_score = (score:number) => {
      if(word.current=="over") return ;
      book.value.word_list[word.current.word].score = score; 
   }

   return (<div style={{ height: "100vh" }}>
      {
         word.current == "over" ?
            <div>没有单词啦</div> :
            is_show ?
               <ComReciteShow mes={word.current} yes={(score)=>{
                  set_score(book.value.word_list[(word.current as BookWordMes)?.word].score+score);
                  word.current = sotre_state_recite.next_word()
                  set_is_show(false);
               }} no={(score)=>{
                  set_score(book.value.word_list[(word.current as BookWordMes)?.word].score-score);
                  word.current = sotre_state_recite.next_word()
                  set_is_show(false);
               }}></ComReciteShow> :
               <ComReciteHide mes={word.current} on_show={() => {
                  set_is_show(true);
               }}></ComReciteHide>

      }

   </div>)
}

export default PageRecite;