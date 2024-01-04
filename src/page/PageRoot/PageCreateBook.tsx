import { Button, Input, Listbox, ListboxItem } from "@nextui-org/react";
import { useState } from "react";
import { allow_premake_book_name, get_premake_book_txt } from "../../serve_app/premake_book_list";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";
import { WordList, store_book_data } from "../../serve_app/sotre_data/sotre_book_data";
import { parse } from "../../serve_app/parse";




const PageCreateBook = () => {
   const navigate = useNavigate();
   const [book_name, set_book_name] = useState("");
   const [select_premake_book, set_select_premake_book] = useState<string[]>([]);

   const return_router = () => {
      navigate(-1);
   }
   const save = () => {
      if (book_name == "") {
         Toast.show("哟!小宝贝~没有名字我可没法打造单词本哦~")
         return;
      }
      store_book_data.creat_book(book_name).then(b => {
         if (b) {
            (async () => {// todo:现在导入5000词大概分析2秒(核心优化点在关闭自动插入),勉勉强强可以接受了,以后管他
               let word_list: WordList = {};
               for(let i=0;i<select_premake_book.length;i++) {
                  const premake_book_name = select_premake_book[i];
                  const txt = await get_premake_book_txt(premake_book_name);
                  word_list = { ...word_list, ...parse(txt) }// todo: 优化:这里有大量拷贝值
               }
               store_book_data.get_book(book_name).put_word_list(word_list, false);
               store_book_data.get_book(book_name).save();
               Toast.show("创建完成,一共"+Object.keys(word_list).length + "个单词")
            })()
         } else {
            Toast.show("粗心哦~这本单词本已经存在了,不怕覆盖辛辛苦苦刷的数据吗")
         }
      })
   }
   return <div className="px-2">
      <Input label="单词本名字" value={book_name} onValueChange={set_book_name}></Input>
      选择要加入的预制单词书(可以不选):
      <Listbox
         aria-label="Multiple selection example"
         variant="flat"
         selectionMode="multiple"
         selectedKeys={select_premake_book}
         onSelectionChange={(v) => set_select_premake_book(Array.from(v).map(v => v.toString()))}
      >
         {
            allow_premake_book_name.map(v =>
               <ListboxItem key={v}>{v}</ListboxItem>)
         }
      </Listbox>
      <Button variant="bordered" onPress={return_router}>返回</Button>
      <Button variant="bordered" color="success" onPress={save}>保存</Button>
   </div>
}

export default PageCreateBook;