import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { book_data } from "../../tool/sotre/store_book";
import { state_select } from "../../tool/state/state_recite";

const PageGate = () => {
   return (
      <>

         <Button>开始复习</Button>
         <Select label="选择你将要复习的单词本" onSelectionChange={v =>state_select.book_name=(v as Set<string>).values().next().value}>
            {
               book_data.store_books.get_all_book_name().map(name =>
                  <SelectItem key={name} value={name} >
                     {name}
                  </SelectItem>)
            }
         </Select>
      </>
   )
}

export default PageGate;