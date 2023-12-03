import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import PageHome from "./page/PageHome";
import PageRoot from "./PageRoot";
import PageGate from "./page/PageHome/PageGate";
import PageMyself from "./page/PageHome/PageMyself";


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
         </Route>
      </Routes>
   )
}

export default App;
