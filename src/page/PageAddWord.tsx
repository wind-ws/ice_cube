import { useNavigate, useParams } from "@solidjs/router";
import { parse } from "../tool/parse";
import { store_book, store_book_fn, store_global, store_global_fn, word } from "../tool/store/book";



const PageAddWord = () => {
   const navigate = useNavigate();
   const params = useParams();
   const book_name = params.book_name;
   let input = "";

   const save = () => {
      const [get_book,_]=store_book.render();
      const [get_global,__]=store_global.render();

      const parse_result = parse(input);
      console.log(parse_result);

      parse_result.forEach(v=>{
         const word_name = v.word;
         store_book_fn.add_word(book_name,word_name);
         store_global_fn.add_global_word(word_name);
         if(v.star != null){
            store_global_fn.set_star(word_name,v.star);
         }
         if(v.label.length != 0){
            store_global_fn.set_label(word_name,v.label);
         }
         if(v.related_word.length != 0){
            store_global_fn.set_related_word(word_name,v.related_word);
         }
      })
      console.log(get_book);
      console.log(get_global);
   }
   const _return = () => {
      navigate(-1);
   }
   return <div class="p-4">
      <p>当前操作的是{book_name}</p>
      <textarea class="textarea textarea-bordered w-full h-72"
         placeholder="新格式:
一行一个单词
<word>            // 单个单词
<word> *          // star为ture
<word> #<label>   // 添加多个标签(不可包含空格)
<word> @<word>@    // 添加自定义的相似词,相似词中有空格,封闭语法"
      oninput={(v)=>{
         input = v.currentTarget.value;
      }}>
      </textarea>
      <div class="flex">
         自动为词组添加标签 #phrase
      </div>
      <div class="flex justify-end gap-x-2">
         <div class="btn btn-outline" onclick={_return}>
            Return
         </div>
         <div class="btn btn-success" onclick={save}>
            Save
         </div>
      </div>

   </div>
}
export default PageAddWord;