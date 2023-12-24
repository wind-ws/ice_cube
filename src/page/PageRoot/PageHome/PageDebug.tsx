import { Store } from "@tauri-apps/plugin-store";
import { store_book_data } from "../../../serve_app/sotre_data/sotre_book_data";
import { StoreValue } from "../../../serve_app/store";
import { all_premake_book_names } from "../../../serve_app/premake_book_list";


/// 安心在这个页面 尝试和测试 玩意八
const PageDebug = () => {

   console.log(all_premake_book_names);
   

   return <div>

   </div>
}

export default PageDebug