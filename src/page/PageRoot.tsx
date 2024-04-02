import { useNavigate } from "@solidjs/router";
import { Toaster } from 'solid-toast';

const PageRoot = (props: any) => {
   const navigate = useNavigate();
   navigate("/loading");// 为了方便, 让所有路径都先去 "/loading" 路径,把所有存储资源加载后,再回去

   return (<>
      {props.children}
      <Toaster />
   </>)
}

export default PageRoot;