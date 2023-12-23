import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import PageHome from "./page/PageRoot/PageHome";
import PageRoot from "./page/PageRoot";
import PageGate from "./page/PageRoot/PageHome/PageGate";
import PageMyself from "./page/PageRoot/PageHome/PageMyself";
import PageParse from "./page/PageRoot/PageParse";
import PageRecite from "./page/PageRoot/PageRecite";
import PageCreateFilter from "./page/PageRoot/PageCreateFilter";
import PageDebug from "./page/PageRoot/PageHome/PageDebug";
import PageLoad from "./page/PageLoad";


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
         <Route index element={<Navigate to="/load" replace />} />
         <Route path="/" element={<PageRoot />} >
            <Route path="/load" element={<PageLoad />} />
            <Route path="/home" element={<PageHome />} >
               <Route path="/home/gate" element={<PageGate />} />
               <Route path="/home/myself" element={<PageMyself />} />
               <Route path="/home/debug" element={<PageDebug />} />
            </Route>
            <Route path="/parse/:name" element={<PageParse />} />
            <Route path="/recite" element={<PageRecite />} />
            <Route path="/create_filter" element={<PageCreateFilter />} />
         </Route>
      </Routes>
   )
}

export default App;
