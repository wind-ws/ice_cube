import { startTransition, useEffect, useRef, useState } from "react";
import ComReciteHide from "../component/ComReciteHide";
import { sotre_state_recite } from "../serve_app/state/state_recite";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { store_filter } from "../serve_app/filter";
import { BookWordMes } from "../serve_app/word";
import { TranslateType } from "../serve_app/translation";
import ComReciteShow from "../component/ComReciteShow";
import { book_data } from "../serve_app/sotre/store_book";
import { now } from "../tool/time";




const PageRecite = () => {
   const navigate = useNavigate();
   if (sotre_state_recite.value.value.book_name == undefined) {
      navigate("/home/gate");
   }
   const book = book_data.store_books.value[sotre_state_recite.value.value.book_name as string];
   const [word,set_word] = useState<BookWordMes | "over">(()=>sotre_state_recite.get_current_word());
   const [is_show, set_is_show] = useState(false);

   const set_score = (score: number) => {
      if (word == "over") return;
      book.value.word_list[word.word].score = score;
   }

   console.warn(sotre_state_recite);
   
   const yes_no = (score: number) => {
      const word_mes = (word as BookWordMes);
      set_score(book.value.word_list[word_mes.word].score + score);
      //改变上次遇到这个单词的时间, 设置为 当前时间
      book_data.store_books.set_word_time(book.value.book_name, word_mes.word, now());
      if (score < 0) {//选择的不会
         book_data.store_books.plus_word_no(book.value.book_name, word_mes.word);
      } else if (score > 0) {//选择的会
         book_data.store_books.plus_word_yes(book.value.book_name, word_mes.word);
      }
      set_word(sotre_state_recite.next_word())
      set_is_show(false);
   }
   const on_show = () => {
      set_is_show(true);

   }

   return (<div style={{ height: "100vh" }}>
      {
         word == "over" ?
            <div>没有单词啦</div> :
            is_show ?
               <ComReciteShow mes={word}
                  translations={sotre_state_recite.get_translation(word.word)}
                  index={sotre_state_recite.value.value.index + 1 }
                  len={sotre_state_recite.value.value.word_list.length}
                  yes_no={yes_no} ></ComReciteShow>
               :
               <ComReciteHide mes={word}
                  index={sotre_state_recite.value.value.index + 1}
                  len={sotre_state_recite.value.value.word_list.length}
                  on_show={on_show}></ComReciteHide>

      }

   </div>)
}

export default PageRecite;