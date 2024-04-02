import { useNavigate } from "@solidjs/router";
import { StoreValue } from "../tool/store";
import { store_book, store_global } from "../tool/store/book";
import { store_setting } from "../tool/store/setting";
import { store_state } from "../tool/store/state";
import { translate } from "../tool/translation";


const PageLoading = () => {
   const navigate = useNavigate();
   store_book;
   store_global;
   store_setting;
   store_state;
   const id = setInterval(() => {
      // console.log(StoreValue.load_list);
      if (StoreValue.is_load()) {
         console.log("All loaded");
         navigate(-1);
         clearInterval(id);
      }
   }, 2);

   return <div>
      正在加载存储资源...

   </div>
}
export default PageLoading;