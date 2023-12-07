import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { sotre_state_recite } from "../../tool/state/state_recite";
import { store_filter } from "../../tool/filter";
import { Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";

const PageGate = () => {
   const navigate = useNavigate();

   const start = () => {
      if (sotre_state_recite.value.value.book_name == undefined) {
         Toast.show("请选择单词本")
         return;
      }
      navigate("/recite");
   }

   return (
      <>

         <Button onPress={start}>开始复习</Button>
         <Select label="选择你将要复习的单词本"
         defaultSelectedKeys={sotre_state_recite.value.value.book_name?[sotre_state_recite.value.value.book_name]:undefined}
            onSelectionChange={v => sotre_state_recite.value.value.book_name = (v as Set<string>).values().next().value}>
            {
               book_data.store_books.get_all_book_name().map(name =>
                  <SelectItem key={name} value={name} >
                     {name}
                  </SelectItem>)
            }
         </Select>
         <Select
            label="选择你将要使用的过滤器"
            selectionMode="multiple"
            defaultSelectedKeys={sotre_state_recite.value.value.filters}
            onSelectionChange={v => sotre_state_recite.filters = Array.from(v).map(v => v.toString())}>
            {
               store_filter.get_all_filter_name().map(name =>
                  <SelectItem key={name} value={name}>
                     {name}
                  </SelectItem>)
            }
         </Select>
      </>
   )
}

export default PageGate;