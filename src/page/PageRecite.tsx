import { Match, Switch, batch, createEffect, createSignal, onMount } from "solid-js";
import { option_fn, Option } from "../tool/option";
import { store_setting } from "../tool/store/setting";
import { mod_recite_state, store_state } from "../tool/store/state";
import { store_book, store_book_fn, store_global, store_global_fn, word } from "../tool/store/book";
import { TranslateTypeStore, get_audio } from "../tool/translation";
import { AiOutlineEye } from "solid-icons/ai";
import { FiTrendingDown, FiTrendingUp } from "solid-icons/fi";
import { get_differ_days } from "../tool/time";
import { WiDaySunny } from "solid-icons/wi";
import { useScroll } from "solidjs-use";
import { RiSystemSettingsLine } from 'solid-icons/ri'
import { RiSystemDeleteBin4Line } from 'solid-icons/ri'
import { useNavigate } from "@solidjs/router";
import { createStore, produce } from "solid-js/store";
import { createSign } from "crypto";

const PageRecite = () => {
   const [state, set_state] = store_state.render();

   return <div class="h-full w-full ">
      {
         option_fn(state.recite_state).is_some()
            ? <Reciting />
            : <Over />
      }
   </div>
}
function Reciting() {
   const [page, set_page] = createSignal<"invisible" | "visible">("invisible");
   // const [setting, set_setting] = store_setting.render();
   const [state, set_state] = store_state.render();
   const [book, set_book] = store_book.render();
   const [global, set_global] = store_global.render();
   const recite_state = option_fn(state.recite_state).unwrap();
   const book_name = recite_state.book_name;
   let [word, set_word] = createStore(option_fn(mod_recite_state.current_word())
      .match<word.Word>((v) => {
         return book[book_name].word_list[v]
      }, () => {
         // 没有单词啦~ 修改状态 //todo
         return null as unknown as word.Word;
      }))
   let audio = get_audio(word.word);
   createEffect(() => {
      set_word(option_fn(mod_recite_state.current_word())
         .match<word.Word>((v) => {
            return book[book_name].word_list[v]
         }, () => {
            // 没有单词啦~ 修改状态 //todo
            return null as unknown as word.Word;
         }))
      audio = get_audio(word.word);
   })



   return <div class="h-full w-full">
      <Switch fallback={<div>Not Found</div>}>
         <Match when={page() == "invisible"}>
            <Invisible />
         </Match>
         <Match when={page() == "visible"}>
            <Visible />
         </Match>
      </Switch>
   </div>
   function delete_word() {

   }

   function Progress() {
      return <div class="flex gap-x-2 h-5 w-full justify-center items-center">
         {recite_state.index}
         <progress class="progress w-[80%] bg-zinc-200" value={recite_state.index} max={recite_state.list.length}></progress>
         {recite_state.list.length}
      </div>
   }
   function Tags() {
      return <>
         <div class="badge  badge-ghost">
            {word.score}
         </div>
         <div class="badge   badge-success">
            {word.yes}
         </div>
         <div class="badge badge-error">
            {word.no}
         </div>
         <div class="badge  badge-ghost">
            <WiDaySunny />
            {get_differ_days(word.last_time)}
         </div>
      </>
   }
   function TopBar() {
      const [get,set] = store_setting.render();
      return <div class="flex flex-row-reverse items-center px-4 gap-4 w-full h-full">
         <div class="btn btn-ghost p-0"
            onclick={(e) => {
               (document.getElementById('modal_setting') as any)?.showModal()
               e.stopPropagation();
            }}>
            <RiSystemSettingsLine class=" text-2xl" />
         </div>
         <div class="btn btn-ghost p-0"
            onclick={(e) => {
               batch(() => {
                  const word_name = word.word;
                  if (recite_state.index + 1 == recite_state.list.length) {
                     //复习完成,清空状态
                     mod_recite_state.clear_recite_state()
                  } else {
                     set_state("recite_state", produce(v => {
                        option_fn(v).match((v) => {
                           v.index = v.index + 1;
                        }, () => { })
                     }));
                  }
                  store_book_fn.delete_word(book_name, word_name);
                  store_state.save_debounced_fn();
                  store_book.save_debounced_fn();
               })
               e.stopPropagation();
            }}>
            <RiSystemDeleteBin4Line class=" text-2xl text-red-400" />
         </div>
         <dialog id="modal_setting" class="modal">
            <div class="modal-box" onclick={(e) => { e.stopPropagation() }}>
               <h3 class="font-bold text-lg">Setting</h3>
               <div class="w-full ">
                  <div class="form-control">
                     <label class="label cursor-pointer">
                        <span class="label-text">自动发音</span>
                        <input type="checkbox" class="toggle" checked={get.recite.is_auto_pronunciation} 
                        oninput={() => {
                           set("recite","is_auto_pronunciation",!get.recite.is_auto_pronunciation)
                        }} />
                     </label>
                  </div>
                  <div class="form-control">
                     <label class="label cursor-pointer">
                        <span class="label-text">听单词模式</span>
                        <input type="checkbox" class="toggle" checked={get.recite.is_listen_mode} 
                        oninput={() => {
                           set("recite","is_listen_mode",!get.recite.is_listen_mode)
                        }} />
                     </label>
                  </div>
                  <div class="form-control">
                     <label class="label cursor-pointer">
                        <span class="label-text">自动展开</span>
                        <input type="checkbox" class="toggle" checked={get.recite.is_auto_show} 
                        oninput={() => {
                           set("recite","is_auto_show",!get.recite.is_auto_show)
                        }} />
                     </label>
                  </div>                  
               </div>
            </div>
            <form method="dialog" class="modal-backdrop">
               <button onclick={(e) => { e.stopPropagation() }}>close</button>
            </form>
         </dialog>
      </div>
   }

   function Invisible() {
      onMount(() => {
         store_global_fn.load_translation(word.word)
      })
      return <div class="flex flex-col h-screen w-full"
         onclick={() => { // 点击空白处 发音
            audio.play()
         }}>
         <div class="flex flex-col flex-initial h-20 w-full ">
            <div class="flex w-full">
               <Progress />
            </div>
            <div class="flex w-full h-full">
               <TopBar />
            </div>
         </div>
         <div class="flex flex-col flex-1 w-full bg-emerald-100">
            <div class="flex w-full h-16 bg-lime-100 text-2xl justify-center items-center  font-semibold ">
               {word.word}
            </div>
            <div class="flex gap-x-2 px-4 w-full h-8 ">
               <Tags />
            </div>
         </div>
         <div class="flex flex-initial justify-center items-center h-32 w-full bg-amber-100">
            <div class="btn btn-ghost  w-[70%] h-[60%] active:bg-blue-100"
               onclick={(e) => {
                  set_page("visible");
                  e.stopPropagation();
               }}>
               <AiOutlineEye class="w-[50%] h-[50%] text-blue-400" />
            </div>
         </div>
      </div>
   }
   function Visible() {
      const plus_score = store_book_fn.plus_score(word.score);
      const minus_score = store_book_fn.minus_score(word.score);

      onMount(() => {
         document.getElementById("center")?.scrollIntoView({ behavior: "instant" });
      })
      return <div class="flex flex-col h-screen w-full"
         onclick={() => { // 点击空白处 发音
            audio.play()
         }}>
         <div class="flex flex-initial h-20 w-full bg-zinc-400">
            <Progress />
            <div class="flex ">

            </div>
         </div>
         <div class="flex flex-col flex-1 w-full bg-emerald-100">
            <div class="flex w-full h-16 bg-lime-100 text-2xl justify-center items-center  font-semibold ">
               {word.word}
            </div>
            <div class="flex gap-x-2 px-4 w-full h-8 ">
               <Tags />
            </div>
            <div class="flex justify-center w-full h-full bg-fuchsia-300">
               <div class="carousel carousel-center w-full  p-4 space-x-4  rounded-box scroll-auto">
                  <div class="carousel-item w-[82%] rounded-box p-4 glass ">
                     123
                  </div>
                  <div id="center" class="carousel-item w-[82%] p-4 glass rounded-box ">
                     {
                        option_fn(global[word.word].translation).match(v => {
                           return v.paraphrase
                        }, () => {
                           return "等待翻译加载"
                        })
                     }
                  </div>
                  <div class="carousel-item w-[82%]  p-4 rounded-box glass">
                     789
                  </div>
               </div>
            </div>
         </div>

         <div class="flex flex-initial justify-evenly items-center h-32 w-full ">
            <div class="flex flex-col btn btn-ghost  w-[40%] h-[60%] text-green-400 active:bg-green-100"
               onclick={(e) => {//yes
                  if (recite_state.index + 1 == recite_state.list.length) {
                     //复习完成,清空状态
                     mod_recite_state.clear_recite_state()
                     return;
                  }
                  mod_recite_state.next(plus_score);
                  set_page("invisible");
                  e.stopPropagation();
               }}>
               <FiTrendingUp class="w-[50%] h-[50%] text-green-400" />
               {plus_score}
            </div>
            <div class="flex flex-col btn btn-ghost  w-[40%] h-[60%] text-red-400 active:bg-red-100"
               onclick={(e) => {//no
                  if (recite_state.index + 1 == recite_state.list.length) {
                     //复习完成,清空状态
                     mod_recite_state.clear_recite_state()
                     return;
                  }
                  mod_recite_state.next(-minus_score);
                  set_page("invisible");
                  e.stopPropagation();
               }}>
               <FiTrendingDown class="w-[50%] h-[50%] text-red-400" />
               {minus_score}
            </div>
         </div>
      </div>
   }
}
function Over() {
   const navigate = useNavigate();

   return <div class="flex flex-col">
      复习完毕
      todo: 统计:总个数,时间,错误个数
      <div class="btn" onclick={() => {
         navigate("/home")
      }}>
         回到主页
      </div>
   </div>
}

export default PageRecite;