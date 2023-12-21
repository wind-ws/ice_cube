import { Badge, TabBar } from 'antd-mobile'
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Icons } from '../serve_app/icons';

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
            icon: (active: boolean) => active ?
               <Icons.HeroiconsOutline.BookOpenIcon className='w-full h-full text-blue-300' />
               : <Icons.HeroiconsOutline.BookOpenIcon className='w-full h-full text-slate-400' />,
            title: '大门',
         },
         {
            key: '/home/myself',
            icon: (active: boolean) => active ?
               <Icons.HeroiconsOutline.Cog6ToothIcon className='w-full h-full text-blue-300' />
               : <Icons.HeroiconsOutline.Cog6ToothIcon className='w-full h-full text-slate-400' />,
            title: '我自己哦!',
         },]
      return (
         <div className=" bg-slate-50 w-full h-12"
            style={{ flex: 0 }}>
            <TabBar activeKey={location.pathname} onChange={value => { navigate(value) }}>
               {tabs.map(item => (
                  <TabBar.Item key={item.key} icon={item.icon} />
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
