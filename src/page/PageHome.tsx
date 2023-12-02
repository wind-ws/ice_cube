import { Button } from "@nextui-org/react"
import { Tabs, Tab } from "@nextui-org/react";


const PageHome = () => {

   /// 底部导航栏
   const BottomNav = () => {
      return (
         <>
            <div className="fixed bottom-0 bg-blue-200 w-full h-12">
               <Tabs key="0" aria-label="Tabs sizes" classNames={{tabList:"w-full gap-6 w-full relative rounded-none p-0 border-b border-divider  "}}>
                  <Tab key="photos" title="Photos" />
                  <Tab key="music" title="Music" />
                  <Tab key="videos" title="Videos" />
               </Tabs>
            </div>
            {/* 占位元素 */}
            <div className="w-full h-12"></div>
         </>
      )
   }

   return (
      <>
         <div className=" top-0 bg-slate-300 w-full ">
            {
               Array
                  .from({ length: 20 }, (_, index) => index + 1)
                  .map(v => <div key={v} className="w-full bg-slate-300 h-12">{v}</div>)
            }
         </div>
         <BottomNav></BottomNav>
      </>
   )
}
export default PageHome;
