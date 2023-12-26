import { Card, CardBody, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { store_filter } from "../serve_app/sotre_data/sotre_filter"
import { Icons } from "../serve_app/icons";


type Props = {
   filter_name: string,/// 过滤器的name
   on_delete_filter: () => void,//告诉外面,执行了删除过滤器
}

const ComFilterCard = ({ filter_name, on_delete_filter }: Props) => {

   const filter = store_filter.get_filter(filter_name).unwrap();
   const delete_filter = () => {
      store_filter.delete_filter(filter_name);
      on_delete_filter()
   }
   return <div className="w-full h-full">
      <Dropdown>
         <DropdownTrigger>
            <Card isPressable fullWidth isBlurred className="p-2 h-full">
               <CardHeader className="h-auto p-0 mb-2">
                  {filter_name}
               </CardHeader>
               <CardBody className="flex-row gap-1 h-auto p-0 items-center flex-wrap">
                  <Chip size="sm" color="primary" variant="flat">{filter.max_word_num == 0 ? "∞" : filter.max_word_num}</Chip>
                  {
                     (() => {
                        if (filter.score_range == null)
                           return <></>
                        switch (filter.score_range[0]) {
                           case "in": return <Chip size="sm" color="warning" variant="flat">
                              {filter.score_range[1] + "~" + filter.score_range[2]}</Chip>
                           case "lowest": return <Icons.HeroiconsOutline.ChevronDoubleDownIcon
                              className="h-[20px] w-auto text-slate-300" />
                           case "largest": return <Icons.HeroiconsOutline.ChevronDoubleUpIcon
                              className="h-[20px] w-auto text-slate-300" />
                        }
                     })()
                  }
                  {
                     (() => {
                        if (filter.time_range == null)
                           return <></>
                        switch (filter.time_range[0]) {
                           case "in": return <Chip size="sm" color="secondary" variant="flat"
                              startContent={<Icons.HeroiconsOutline.ClockIcon 
                                 className="h-[60%] w-[60%] text-purple-800" />}>
                              {filter.time_range[2] + "~" + filter.time_range[1]}</Chip>
                           case "recent": return <Icons.HeroiconsOutline.ClockIcon className="h-[20px] w-auto text-green-400" />
                           case "ago": return <Icons.HeroiconsOutline.ClockIcon className="h-[20px] w-auto text-red-400" />
                        }
                     })()
                  }
                  {
                     (() => {
                        if (filter.first_time == null)
                           return <></>
                        switch (filter.first_time[0]) {
                           case "in": return <Chip size="sm" color="success" variant="flat"
                              startContent={<Icons.HeroiconsOutline.ClockIcon 
                                 className="h-[60%] w-[60%] text-green-600" />}>
                              {filter.first_time[1] + "~" + filter.first_time[2]}</Chip>
                        }
                     })()
                  }
                  {
                     (() => {
                        if (filter.yes_no == null)
                           return <></>
                        switch (filter.yes_no[0]) {
                           case "yes>=no": return <Icons.HeroiconsOutline.CheckIcon className="h-[20px] w-auto text-slate-300" />
                           case "no>=yes": return <Icons.HeroiconsOutline.XMarkIcon className="h-[20px] w-auto text-slate-300" />
                        }
                     })()
                  }
                  {
                     filter.is_star == null ? <></> : (
                        filter.is_star ?
                           <Icons.HeroiconsMiniSolid.StarIcon className="h-[20px] w-auto text-yellow-200" />
                           :
                           <Icons.HeroiconsMiniSolid.StarIcon className="h-[20px] w-auto text-slate-300" />
                     )
                  }

               </CardBody>
            </Card>
         </DropdownTrigger>
         <DropdownMenu
            aria-label="Static Actions"
            disabledKeys={["copy", "watch", "filter_delete_word"]}>

            <DropdownItem key="delete" onPress={delete_filter} className="text-danger" color="danger">
               删除过滤器
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   </div>
}

export default ComFilterCard