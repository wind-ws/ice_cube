import { Button, Textarea } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { parse } from "../../serve_app/parse";
import { useState } from "react";
import { store_book_data } from "../../serve_app/sotre_data/sotre_book_data";

const PageParse = () => {
   const params = useParams();
   const navigate = useNavigate();
   const book_name = params['name'] as string;// book name
   let [str,set_str] = useState("");
   const return_router = () => {//返回上一个路由
      navigate(-1)
   }
   const save=()=>{//保存进单词本
      const word_list = parse(str);
      const book = store_book_data.get_book(book_name);
      book.put_word_list(word_list,false);
      book.save();
   }
   
   return (<div>
      <Textarea
         value={str}
         onValueChange={set_str}
         label={`目标单词本:${book_name}`}
         maxRows={12}
         placeholder={`一行一个单词,格式2的<note>部分可以换行\n格式1: <word> \n格式2: <word>|<note>|\n例如:\ndick\ndick | abc |\ndick |\nabc\n|`}
         className="w-full h-full"
      />
      <Button variant="bordered" onPress={return_router}>返回</Button>
      <Button variant="bordered" color="success" onPress={save}>保存</Button>
   </div>)
}

export default PageParse