import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { sotre_state_recite } from "../../tool/state/state_recite";
import { store_filter } from "../../tool/filter";
import { Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { use_state } from "../../tool/store";

const PageGate = () => {
   const navigate = useNavigate();

   // const [default_select_filters,set_default_select_filters] = useState<string[]>(sotre_state_recite.value.value.filters);
   console.log(sotre_state_recite.value.value);
   
   const default_select_book = use_state(sotre_state_recite.value.value, "book_name");
   
   const [default_select_filters, set_default_select_filters] = sotre_state_recite.value
      .useState(sotre_state_recite.value.value,"filters")
   
   
   const [b, set_b] = useState(true);
   if (b) {// 延时后触发渲染,因为 异步流 加载有点慢,这里又是一进来就看的页面,会导致 异步流还未加载完成,就已经渲染完成,内容没有加载成功
      setTimeout(() => {
         // set_b(false)
      }, 300)
   }


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
            selectedKeys={default_select_book ? [default_select_book] : undefined}
            onSelectionChange={v => set_default_select_book(Array.from(v).map(v => v.toString())[0])}>
            {
               book_data.store_books.get_all_book_name().map(name =>
                  <SelectItem key={name} value={name} >
                     {name}
                  </SelectItem>)
            }
         </Select>
         {/* <Select
            label="选择你将要使用的过滤器"
            selectionMode="multiple"
            // selectedKeys={default_select_filters}
            defaultSelectedKeys={default_select_filters}
            onSelectionChange={v => set_default_select_filters(Array.from(v).map(v => v.toString()))}>
            {
               store_filter.get_all_filter_name().map(name =>
                  <SelectItem key={name} value={name}>
                     {name}
                  </SelectItem>)
            }
         </Select> */}
      </>
   )
}

export default PageGate;