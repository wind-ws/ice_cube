import { useNavigate } from "react-router-dom";
import { StoreValue } from "../serve_app/store"
import { store_book_data } from "../serve_app/sotre_data/sotre_book_data";
import { store_filter } from "../serve_app/sotre_data/sotre_filter";
import { store_word_golbal } from "../serve_app/sotre_data/store_word_golbal";
import { store_recite_state } from "../serve_app/store_state/sotre_recite_state";

/// 等待异步加载完成后 进入PageRoot(app使用的界面)
/// 等待加载的界面
const PageLoad = () => {
   const navigate = useNavigate();
   if (true) {//nnd,居然不会自动调用初始化
      store_book_data.value
      store_filter.value
      store_recite_state.value
      store_word_golbal.value
   }
   const inter_id = setInterval(() => {
      if (StoreValue.is_load()) {
         clearInterval(inter_id);
         navigate("/home/gate")
      }
   }, 20)

   return <div>
      等待异步流加载完成
   </div>
}

export default PageLoad