import { useNavigate } from "react-router-dom";


const PageGate = () => {
   const navigate = useNavigate();


   const start = () => {
      navigate("/recite");
   }

   const Head = () => {
      return <div className="flex flex-initial h-36">
         
      </div>
   }
   const Body = () => {
      return <div className="flex flex-1">

      </div>
   }
   const Foot = () => {
      return <div className="flex flex-initial items-center justify-center h-24 ">
         <div className="flex items-center justify-center
            rounded-md border-2 border-stone-300
            transition-all
            bg-slate-100 active:bg-blue-100 
            w-[70%] active:w-[68%]
            h-[70%] active:h-[68%]"
            onClick={start}>
            开始复习
         </div>
      </div>
   }
   return (
      <div className="flex flex-col h-full w-full">
         <Head></Head>
         <Body></Body>
         <Foot></Foot>
      </div>
   )
}

export default PageGate;