import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";


import './index.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
   <React.StrictMode>
      <NextUIProvider>
         <BrowserRouter>
            <App />   
         </BrowserRouter>
      </NextUIProvider>
   </React.StrictMode>,
);
