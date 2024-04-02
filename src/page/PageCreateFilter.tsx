import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { StoreFilter } from "../tool/filter";
import { setting_filter_fn } from "../tool/store/setting";
import toast from "solid-toast";


const PageCreateFilter = () => {
   const navigate = useNavigate();
   let filter_name = "";
   const [max_word_num, set_max_word_num] = createSignal(0);
   const [is_star, set_is_star] =
      createSignal<StoreFilter["is_star"]>(null);
   const [score_range, set_score_range] =
      createSignal<StoreFilter["score_range"]>(null);
   const [last_time_range, set_last_time_range] =
      createSignal<StoreFilter["last_time_range"]>(null);
   const [first_time, set_first_time] =
      createSignal<StoreFilter["first_time"]>(null);
   const [yes_no, set_yes_no] =
      createSignal<StoreFilter["yes_no"]>(null);

   const _return = () => {
      navigate(-1);
   }
   const create = () => {
      const filter: StoreFilter = {
         name: filter_name,
         max_word_num: max_word_num(),
         is_star: is_star(),
         score_range: score_range(),
         last_time_range: last_time_range(),
         yes_no: yes_no(),
         first_time: first_time(),
         label: null
      }
      setting_filter_fn.add_filter(filter);
      toast(filter_name + '创建成功')
   };

   return <div class="flex flex-col p-5 w-full h-screen">
      <div class="flex w-full">
         <input type="text"
            placeholder="过滤器名"
            class="input w-full"
            oninput={e => {
               filter_name = e.currentTarget.value;
            }} />
      </div>
      <p class=" text-zinc-600 py-2">最大单词量</p>
      <div class="flex w-full">
         <span class="px-2 w-10">{max_word_num()}</span>
         <input type="range" min="0" max="500" step="1" value={max_word_num()}
            class="range" oninput={e => {
               set_max_word_num(Number.parseInt(e.currentTarget.value));
            }} />
      </div>
      <p class=" text-zinc-600 py-2">是否要求star</p>
      <div class="flex w-full">
         <div class="dropdown">
            <div tabindex="0" role="button" class="m-1 btn">
               {is_star() == null ? "不关心" : is_star() ? "为star" : "非star"}</div>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
               <li onclick={() => set_is_star(null)}><a>不关心</a></li>
               <li onclick={() => set_is_star(true)}><a>为star</a></li>
               <li onclick={() => set_is_star(false)}><a>非star</a></li>
            </ul>
         </div>
      </div>
      <p class=" text-zinc-600 py-2">正确错误控制</p>
      <div class="flex w-full">
         <details class="dropdown">
            <summary class="m-1 btn">{
               (() => {
                  if (yes_no() == null)
                     return "不关心";
                  switch (yes_no()?.[0]) {
                     case 'yes>=no': return "yes>=no";
                     case 'no>=yes': return "no>=yes";
                  }
               })()}</summary>
            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
               <li onclick={() => set_yes_no(null)}><a>不关心</a></li>
               <li onclick={() => set_yes_no(["yes>=no"])}><a>{"yes>=no"}</a></li>
               <li onclick={() => set_yes_no(["no>=yes"])}><a>{"no>=yes"}</a></li>
            </ul>
         </details>
      </div>
      <p class=" text-zinc-600 py-2">分数范围控制</p>
      <div class="flex w-full">
         <details class="dropdown">
            <summary class="m-1 btn">{
               (() => {
                  if (score_range() == null)
                     return "不关心";
                  switch (score_range()?.[0]) {
                     case 'in': return "区间控制"
                     case 'lowest': return "尽可能小";
                     case 'largest': return "尽可能大";
                  }
               })()}</summary>
            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
               <li onclick={() => set_score_range(null)}><a>不关心</a></li>
               <li onclick={() => set_score_range(["in", -100, 100])}><a>{"区间控制"}</a></li>
               <li onclick={() => set_score_range(["lowest"])}><a>{"尽可能小"}</a></li>
               <li onclick={() => set_score_range(["largest"])}><a>{"尽可能大"}</a></li>
            </ul>
         </details>
         {
            score_range()?.[0] == "in"
               ? <>
                  <input type="text" placeholder="最小边界"
                     class="input w-28"
                     oninput={e => {
                        const n = Number.parseInt(e.currentTarget.value);
                        set_score_range(["in", n, score_range()?.[2] as number])
                     }} />
                  <input type="text" placeholder="最大边界"
                     class="input w-28"
                     oninput={e => {
                        const n = Number.parseInt(e.currentTarget.value);
                        set_score_range(["in", score_range()?.[1] as number, n])
                     }} />
               </>
               : ""
         }
      </div>
      <p class=" text-zinc-600 py-2">最近一次遇到的时间限制</p>
      <div class="flex w-full">
         <details class="dropdown">
            <summary class="m-1 btn">{
               (() => {
                  if (last_time_range() == null)
                     return "不关心";
                  switch (last_time_range()?.[0]) {
                     case 'in': return "区间控制"
                     case 'recent': return "尽可能最近遇见过的";
                     case 'ago': return "尽可能很久没遇见过的";
                  }
               })()}</summary>
            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
               <li onclick={() => set_last_time_range(null)}><a>不关心</a></li>
               <li onclick={() => set_last_time_range(["in", 0, 7])}><a>{"区间控制"}</a></li>
               <li onclick={() => set_last_time_range(["recent"])}><a>{"尽可能最近遇见过的"}</a></li>
               <li onclick={() => set_last_time_range(["ago"])}><a>{"尽可能很久没遇见过的"}</a></li>
            </ul>
         </details>
         {
            last_time_range()?.[0] == "in"
               ? <>
                  <input type="text" placeholder="最小边界"
                     class="input w-28"
                     oninput={e => {
                        const n = Number.parseInt(e.currentTarget.value);
                        set_last_time_range(["in", n, last_time_range()?.[2] as number])
                     }} />
                  <input type="text" placeholder="最大边界"
                     class="input w-28"
                     oninput={e => {
                        const n = Number.parseInt(e.currentTarget.value);
                        set_last_time_range(["in", last_time_range()?.[1] as number, n])
                     }} />
               </>
               : ""
         }
      </div>
      <p class=" text-zinc-600 py-2">第一次遇到的时间限制</p>
      <div class="flex w-full">
         <details class="dropdown">
            <summary class="m-1 btn">{
               (() => {
                  if (first_time() == null)
                     return "不关心";
                  switch (first_time()?.[0]) {
                     case 'in': return "区间控制"
                     case 'none': return "从未遇见的";
                  }
               })()}</summary>
            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
               <li onclick={() => set_first_time(null)}><a>不关心</a></li>
               <li onclick={() => set_first_time(["in", 0, 7])}><a>{"区间控制"}</a></li>
               <li onclick={() => set_first_time(["none"])}><a>{"从未遇见的"}</a></li>
            </ul>
         </details>
         {
            first_time()?.[0] == "in"
               ? <>
                  <input type="text" placeholder="最小边界"
                     class="input w-28"
                     oninput={e => {
                        const n = Number.parseInt(e.currentTarget.value);
                        set_first_time(["in", n, first_time()?.[2] as number])
                     }} />
                  <input type="text" placeholder="最大边界"
                     class="input w-28"
                     oninput={e => {
                        const n = Number.parseInt(e.currentTarget.value);
                        set_first_time(["in", first_time()?.[1] as number, n])
                     }} />
               </>
               : ""
         }
      </div>
      <div class="flex justify-end gap-x-4 mt-4 w-full">
         <div class="btn btn-outline" onclick={_return}>
            Return
         </div>
         <div class="btn btn-success" onclick={create}>
            Create
         </div>
      </div>
   </div>
}
export default PageCreateFilter;