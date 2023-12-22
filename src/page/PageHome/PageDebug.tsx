import { Store } from "@tauri-apps/plugin-store";


/// 安心在这个页面 尝试和测试 玩意八
const PageDebug = () => {

   const store = new Store("aaaaadebug.json");


   const val = store.get("some-key").then(v=>{
      console.log(v)
   }).catch(err => console.warn(err));

return <div>

   </div>
}

export default PageDebug