import { useNavigate } from "@solidjs/router";
import { store_setting } from "../tool/store/setting";
import { produce } from "solid-js/store";
import { createSignal } from "solid-js";




const PageFilterList = () => {
   const navigate = useNavigate();
   const [get_setting, set_setting] = store_setting.render();
   console.log(get_setting);

   const FilterCard = ({ filter_name }: {
      filter_name: string
   }) => {
      const [is, set_is] = createSignal(get_setting.recite.filter_name_list.includes(filter_name));

      return <div class="flex w-full h-12 bg-zinc-300">
         <div class="dropdown h-full w-full">
            <div tabindex="0" role="button" class="btn w-full h-full" classList={{
               "text-green-300": is(), "text-stone-600": !is()
            }}>{filter_name}</div>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
               <li onclick={() => {
                  if (is()) {
                     set_setting("recite", produce(v => {
                        v.filter_name_list = v.filter_name_list.filter(v => v !== filter_name);
                     }))
                  } else {
                     set_setting("recite", produce(v => {
                        v.filter_name_list.push(filter_name);
                     }))
                  }
                  set_is(!is())
               }}><a>{is() ? "关闭" : "启用"}过滤器</a></li>
               <li><a>编辑过滤器</a></li>
               <li class=" text-red-500" ><a>删除过滤器</a></li>
            </ul>
         </div>
      </div>
   }

   return <div class="flex flex-col gap-y-1 w-full p-4">
      {
         Object.keys(get_setting.filters).map(v => {
            return <FilterCard filter_name={v} />
         })
      }
      <div class="btn" onclick={() => {
         navigate("/create_filter")
      }}>
         创建过滤器
      </div>
   </div>
}
export default PageFilterList;