import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import PageHome from "./page/PageHome";
import PageRoot from "./PageRoot";
import PageGate from "./page/PageHome/PageGate";
import PageMyself from "./page/PageHome/PageMyself";
import PageParse from "./page/PageParse";
import PageRecite from "./page/PageRecite";
import PageCreateFilter from "./page/PageCreateFilter";


function App() {
   return (
      <div className="container">
         <MyRoutes></MyRoutes>
      </div>
   );
}
const MyRoutes = () => {
   return (
      <Routes>
         {/* 初始化进入的路由路径 */}
         <Route index element={<Navigate to="/home/gate" replace />} />
         <Route path="/" element={<PageRoot />} >
            <Route path="/home" element={<PageHome />} >
               <Route path="/home/gate" element={<PageGate />} />
               <Route path="/home/myself" element={<PageMyself />} />
            </Route>
            <Route path="/parse/:name" element={<PageParse />} />
            <Route path="/recite" element={<PageRecite />} />
            <Route path="/create_filter" element={<PageCreateFilter />} />
         </Route>
      </Routes>
   )
}

export default App;
