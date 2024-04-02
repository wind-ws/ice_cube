import { useNavigate } from "@solidjs/router";
import toast from "solid-toast";
import { store_setting } from "../../tool/store/setting";
import { mod_recite_state } from "../../tool/store/state";


const ViewHome = () => {
   const navigate = useNavigate();

   return (<div class="flex flex-col w-full h-full ">
      <div class="flex flex-1">

      </div>
      <div class="flex flex-initial justify-around place-items-center w-full h-32 bg-gray-800">
         <div class=" btn " onclick={() => {
            const [get, _] = store_setting.render();
            if (get.recite.book_name == null || get.recite.book_name == "") {
               toast("请先设置学习的单词本");
               return;
            }
            mod_recite_state.reload_recite_state()
            navigate("/recite")
         }}>
            开始冒险
         </div>
         <div class=" btn " onclick={() => {
            const [get, _] = store_setting.render();
            if (!mod_recite_state.is_recite_state()) {
               toast("不存在复习记录");
               return
            }
            if (get.recite.book_name == null
               || get.recite.book_name == ""
               || get.recite.book_name != mod_recite_state.get_book_name()) {
               toast("切换单词本后,记录会消失");
               return
            }
            mod_recite_state.load_recite_state();
            navigate("/recite")
         }}>
            继续冒险
         </div>
      </div>
   </div>)
}
export default ViewHome;