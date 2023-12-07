import { useRef, useState  } from "react";
import ComRecite from "../component/ComRecite";
import { StateReciteFn, sotre_state_recite } from "../tool/state/state_recite";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";




const PageRecite = ()=>{
   const navigate = useNavigate();
   if(sotre_state_recite.value.value.book_name==undefined){
      navigate("/home/gate");
   }
   const b = useRef(true);
   const fn = useRef<StateReciteFn>();
   if(b.current){
      // fn.current=builder_state_recite_fn(sotre_state_recite.book_name as string,[])
      b.current = false
   }
   const [a,set_a]= useState(0);
   return (<div>
      <ComRecite></ComRecite>
   </div>)
}

export default PageRecite;