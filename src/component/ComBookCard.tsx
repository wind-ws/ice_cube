import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { store_book_data } from "../serve_app/sotre_data/sotre_book_data";

type Props = {
   book_name: string,/// 单词本的name

}

/// 在 PageMyself 界面 用于展示 单词本基本信息
/// 展示基本信息:
///   单词本名
///   单词总量
///   含star总量
/// 单击展开功能:
///   添加单词
///   删除单词本(需要弹出确认框)
///   繁殖(通过筛选器从当前单词本筛选出部分单词,将这些单词 移动进入 其他单词本)
///   筛选删除单词(通过筛选器删除当前单词本中的部分单词)
const ComBookCard = ({ book_name }: Props) => {
   const navigate = useNavigate();
   const add_word=()=>{
      navigate(`/parse/${book_name}`);
   }
   const copy = ()=>{

   }
   const delete_word=()=>{
      
   }
   const delete_book = ()=>{
      store_book_data.delete_book(book_name);
   }
   return (<div className="w-full">
      <Dropdown>
         <DropdownTrigger>
            <Card isPressable fullWidth>
               <CardHeader>
                  {book_name}
               </CardHeader>
               <CardBody>

               </CardBody>
            </Card>
         </DropdownTrigger>
         <DropdownMenu
            aria-label="Static Actions"
            disabledKeys={["copy", "filter_delete_word"]}>
            <DropdownItem key="add" onPress={add_word}>添加单词</DropdownItem>
            <DropdownItem key="copy" onPress={copy} >繁殖</DropdownItem>
            <DropdownItem key="filter_delete_word" onPress={delete_word} >筛选删除单词</DropdownItem>
            <DropdownItem key="delete" onPress={delete_book} className="text-danger" color="danger">
               删除单词本
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   </div>)
}




export default ComBookCard;