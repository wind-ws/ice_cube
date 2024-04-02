
import { OcHome3, OcHomefill3 } from 'solid-icons/oc'
import { RiSystemSettingsFill, RiSystemSettingsLine } from 'solid-icons/ri'
import { createSignal } from 'solid-js'
import ViewHome from './PageHome/ViewHome';
import ViewSetting from './PageHome/ViewSetting';
import { useNavigate } from '@solidjs/router';

const PageHome = () => {
   const [active, set_active] = createSignal<"home"|"setting">("setting");
   

   return (<div
      style={{ height: "100vh", display: "flex", "flex-direction": "column" }}>
      {/* 内容 */}
      <div style={{ flex: 1, display: "flex", overflow: "auto" }}>
         <div class='block w-full h-full'>
            {(()=>{
               switch(active()){
                  case 'home': return <ViewHome/>
                  case 'setting':return <ViewSetting/>
               }
            })()}
         </div>
      </div>
      {/* 导航栏 */}
      <div class='flex flex-initial w-full h-[4rem]'>
         <div class="btm-nav btm-nav-label">
            <button onclick={() => {
               set_active("home");
            }}>
               {active() == "home"
                  ? <OcHomefill3 class=' text-xl' />
                  : <OcHome3 class=' text-xl' />}
            </button>
            <button onclick={() => {
               set_active("setting");
            }}>
               {active() == "setting"
                  ? <RiSystemSettingsFill class=' text-xl' />
                  : <RiSystemSettingsLine class=' text-xl' />}
            </button>
         </div>
      </div>

   </div>)
}



export default PageHome;