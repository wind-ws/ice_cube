import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { sotre_state_recite } from "../../tool/state/state_recite";
import { store_filter } from "../../tool/filter";
import { Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PageGate = () => {
   const navigate = useNavigate();
   
   const [default_select_book,set_default_select_book] = useState<string[]>([]);
   const [default_select_filters,set_default_select_filters] = useState<string[]>([]);
   setTimeout(()=>{//APP一进来就是这个页面,会导致store初始化的异步流还未加载完成,导致渲染状态存在问题
      if(sotre_state_recite.value.value.book_name!=undefined){
         set_default_select_book([sotre_state_recite.value.value.book_name]);
      }
      set_default_select_filters(sotre_state_recite.value.value.filters);
   },1000)
   const start = () => {
      if (sotre_state_recite.value.value.book_name == undefined) {
         Toast.show("请选择单词本")
         return;
      }
      sotre_state_recite.over_load(
         sotre_state_recite.value.value.book_name as string
         , sotre_state_recite.value.value.filters.map(v => store_filter.get_filter(v)));
      sotre_state_recite.value.save();
      navigate("/recite");
   }


   return (
      <>

         <Button onPress={start}>开始复习</Button>
         <Select label="选择你将要复习的单词本"
            defaultSelectedKeys={default_select_book}
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
            defaultSelectedKeys={default_select_filters}
            onSelectionChange={v => sotre_state_recite.value.value.filters = Array.from(v).map(v => v.toString())}>
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