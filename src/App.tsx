import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/primitives";
import { Store } from "@tauri-apps/plugin-store";
import { translate } from "./tool/translation";
import { creat_key } from "./tool/store";



function App() {
   
   return (
      <div className="container">
         <h1>Welcome to Tauri!</h1>

      </div>
   );
}

export default App;
