import { TbStarFilled } from 'solid-icons/tb'
import { RiDocumentNumbersFill } from 'solid-icons/ri'
import { BiRegularDotsHorizontalRounded } from 'solid-icons/bi'
import { store_book, store_book_fn } from '../../tool/store/book'
import { createSignal } from 'solid-js'
import { store_setting } from '../../tool/store/setting'
import { useNavigate } from '@solidjs/router'
import { translate } from '../../tool/translation'
import { open } from '@tauri-apps/plugin-dialog';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { downloadDir } from '@tauri-apps/api/path';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { export_data, import_data } from '../../tool/data_import_export'

const ViewSetting = () => {

   return (<div class='flex flex-col place-items-center gap-y-6 
      px-4 py-8 w-full h-full'>
      
      <div class='flex w-full'>
         <BookFilterData></BookFilterData>
      </div>
      <div class='flex w-full'>
         <DataStatistics></DataStatistics>
      </div>

      <div class='btn' onclick={()=>{
         export_data({file_name:"my_export"})
      }}>
         导出数据(至: */Download/IceCube/ )
      </div>
      <div class='btn' onclick={()=>{
         import_data()
      }}>
         导入数据(todo)
      </div>
      <div class='flex w-full justify-center'>
         当前版本: 0.3.0
      </div>
   </div>)
}
/** 单词本和过滤器 展示
 * 展示正在使用的单词本和过滤器, 统计 单词量,star量,以学习进度,综合评分
 * 展示 切换单词本 , 调整过滤器 , 添加单词
 */
const BookFilterData = () => {
   const navigate = useNavigate();
   const [book, set_book] = store_book.render();
   const [setting, set_setting] = store_setting.render();


   let book_name: string = "";

   return <div class='w-full h-52 
      card  bg-base-100 shadow
      p-4 pt-0'>
      {
         Object.keys(book).length == 0
            ? <div class='flex py-5'>
               <div class="join">
                  <input class="input input-bordered join-item"
                     placeholder="Book name"
                     onInput={(e) => {
                        book_name = e.currentTarget.value;
                     }} />
                  <button class="btn join-item rounded-r-full"
                     onclick={() => {
                        store_book_fn.add_book(book_name);
                     }}>Create</button>
               </div>
            </div>
            : <div class="flex flex-col w-full h-full">
               <div class='h-8 w-full '>
                  <div class="dropdown dropdown-bottom dropdown-end float-right
                     w-min h-8">
                     <div tabindex="0" role="button"
                        class="btn btn-ghost btn-square  w-min h-8">
                        <BiRegularDotsHorizontalRounded class='text-xl h-8' />
                     </div>
                     <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>切换单词本</a></li>
                        <li onclick={() => {
                           navigate("/filter_list");
                        }}><a>调整过滤器</a></li>
                        <li><a>查看单词列表</a></li>
                        <li onclick={() => {
                           navigate("/add_word/" + setting.recite.book_name)
                        }}><a>添加单词</a></li>
                        <li class=' text-red-500' onclick={() => {
                           (document.getElementById('delete_book_in_setting') as any).showModal()
                        }}><a>删除单词本</a></li>
                        <dialog id="delete_book_in_setting" class="modal">
                           <div class="modal-box">
                              <h3 class="font-bold text-lg text-red-600">一个危险的操作</h3>
                              <p class="py-4">这将不可挽回的删除单词本所有数据!</p>
                              <div class="modal-action">
                                 <form method="dialog">
                                    <button class="btn btn-error" onclick={() => {
                                       store_book_fn.delete_book(setting.recite.book_name);
                                    }}>Delete</button>
                                 </form>
                              </div>
                           </div>
                           <form method="dialog" class="modal-backdrop">
                              <button>close</button>
                           </form>
                        </dialog>
                     </ul>
                  </div>
               </div>
               <div class='flex w-full '>
                  <span class=' text-gray-500'>正在学习 </span>
                  <span class=' text-xl font-semibold'>{setting.recite.book_name}</span>
               </div>
               <div class='flex flex-row h-full w-full  justify-between'>
                  <div class='flex flex-col h-full w-[48%] bg-gray-300'>
                     统计 单词量,star量,以学习进度,综合评分
                  </div>
                  <div class='flex h-full w-[48%] bg-gray-400'>
                     过滤器列表
                  </div>
               </div>
            </div>
      }
   </div>
}


/** 数据统计 
 * 总单词量 , 总学习时间
 * 今日学习量 , 今日学习时间
*/
const DataStatistics = () => {

   return (
      <div class="stats shadow w-full">
         <div class="stat">
            <div class="stat-figure text-secondary">
               <RiDocumentNumbersFill class=' text-3xl text-orange-300' />
            </div>
            <div class="stat-title">Word</div>
            <div class="stat-value">5000</div>
            <div class="stat-desc">Keep it up</div>
         </div>

         <div class="stat">
            <div class="stat-figure ">
               <TbStarFilled class=' text-3xl text-orange-300' />
            </div>
            <div class="stat-title">Star</div>
            <div class="stat-value">999</div>
            {/* <div class="stat-desc">↗︎ 400 (22%)</div> */}
         </div>
      </div>
   )
}

export default ViewSetting;