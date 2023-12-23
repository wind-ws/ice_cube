import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { lazy, useEffect, useRef, useState, useSyncExternalStore } from "react";


const PageGate = () => {
   const navigate = useNavigate();


   const start = () => {


      navigate("/recite");
   }


   return (
      <>

   
      </>
   )
}

export default PageGate;