import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { book_data } from "../tool/sotre/store_book";
import { useNavigate } from "react-router-dom";

type Props = {
   names: string[],/// 单词本的name
   index: number,  /// 指定的key
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
const ComBookCard = ({ names, index }: Props) => {
   const navigate = useNavigate();
   const name = names[index]
   const add=()=>{
      navigate(`/parse/${name}`);
   }
   const _delete=()=>{
      
   }
   return (<div className="max-w-[40%]">
      <Dropdown>
         <DropdownTrigger>
            <Card isPressable fullWidth>
               <CardHeader>
                  {name}
               </CardHeader>
               <CardBody>

               </CardBody>
            </Card>
         </DropdownTrigger>
         <DropdownMenu
            aria-label="Static Actions"
            disabledKeys={["copy", "filter_delete_word"]}>
            <DropdownItem key="add" onPress={add}>添加单词</DropdownItem>
            <DropdownItem key="copy"  >繁殖</DropdownItem>
            <DropdownItem key="filter_delete_word" >筛选删除单词</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
               删除单词本
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   </div>)
}




export default ComBookCard;