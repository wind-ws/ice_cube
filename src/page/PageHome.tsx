import { Badge, TabBar } from 'antd-mobile'
import { Outlet, useNavigate ,useLocation} from "react-router-dom";

const PageHome = () => {
   const navigate = useNavigate();
   const location = useLocation();
   
   /// 
   const Body = () => {
      return (
         <div style={{ flex: 1, display: "flex", overflow: "auto" }}>
            <div className='block w-full h-full'>
               <Outlet />
            </div>
         </div>
      )
   }
   /// 底部导航栏
   const BottomNav = () => {
      const tabs = [
         {
            key: '/home/gate',
            title: '大门',
         },
         {
            key: '/home/myself',
            title: '我自己哦!',
         },]
      return (
         <div className=" bg-orange-200 w-full h-12"
            style={{ flex: 0 }}>
            <TabBar activeKey={location.pathname} onChange={value => {navigate(value)}}>
               {tabs.map(item => (
                  <TabBar.Item key={item.key} title={item.title} />
               ))}
            </TabBar>
         </div>
      )
   }

   return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
         <Body></Body>
         <BottomNav></BottomNav>
      </div>
   )
}
export default PageHome;
