import * as React from "react";
import { Routes, Route, redirect, useNavigate } from "react-router-dom";
import PageHome from "./page/PageHome";
import PageRoot from "./PageRoot";

function App() {
   const navigate = useNavigate();
   // 初始进入/home
   navigate("/home")

   return (
      <div className="container">
         <MyRoutes></MyRoutes>
      </div>
   );
}
const MyRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<PageRoot />} >
            <Route path="/home" element={<PageHome />} />
         </Route>
      </Routes>
   )
}

export default App;
