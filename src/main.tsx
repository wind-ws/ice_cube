import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";


import './index.css';
// setTimeout(()=>{
   ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
         <NextUIProvider>
            <BrowserRouter>
               <App />   
            </BrowserRouter>
         </NextUIProvider>
      </React.StrictMode>,
   );
// },100);//等sotre异步流加载,在加载页面,不能这样搞,妈的,编码阶段等的太久了

