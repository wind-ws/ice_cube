import { Button, Textarea } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { parse } from "../tool/parse";
import { book_data, book_golbal } from "../tool/sotre/store_book";
import { useState } from "react";

const PageParse = () => {
   const params = useParams();
   const navigate = useNavigate();
   const name = params['name'] as string;// book name
   let [str,set_str] = useState("");
   const return_router = () => {//返回上一个路由
      navigate(-1)
   }
   const save=()=>{//保存进单词本
      const word_list = parse(str);
      book_data.store_books.put_word_list(name,word_list,false);
      // book_data.store_books.delete_all_word(name);
      book_data.store_books.value[name].save();
      // console.log(book_data.store_books.value[name]);
   }
   
   return (<div>
      <Textarea
         value={str}
         onValueChange={set_str}
         label={`目标单词本:${name}`}
         maxRows={12}
         placeholder={`一行一个单词,格式2的<note>部分可以换行\n格式1: <word> \n格式2: <word>|<note>|\n例如:\ndick\ndick | abc |\ndick |\nabc\n|`}
         className="w-full h-full"
      />
      <Button variant="bordered" onPress={return_router}>返回</Button>
      <Button variant="bordered" color="success" onPress={save}>保存</Button>
   </div>)
}

export default PageParse