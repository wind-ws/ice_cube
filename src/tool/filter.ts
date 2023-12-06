

/// 过滤器设计
/// 用于复习时过滤单词
/// 是否存在 star
/// score 大于多少,或超过的百分比
/// 不用百分比, 控制过滤器对 最大单词量的数量, 让多个过滤器配合
/// ...

import { get_random_int } from "./random";
import { book_data, book_golbal } from "./sotre/store_book"
import { StoreKey, StoreValue, creat_key } from "./store";
import { day, now } from "./time";
import { BookWordMes } from "./word";

/// 这是一个存储类型
export type StoreFilter = {
   name: string,//过滤器名字
   max_word_num: number,//最大单词量,若是0则 不限制单词数量,实际过滤的单词量超过max_word_num则随机取单词 , 过滤低优先级
   is_star: boolean | null, // 过滤高优先级
   score_range: null //分数范围控制 //由于分数变动性高,我认为取固定值是无意义的
   | ["in", number, number] //[a,b]  过滤高优先级
   // | ["out", number, number] //[-,a]||[b,+] 过滤高优先级
   // | ["more", number] //[b,+] //这个可以用 in 代替, +部分足够高就可以啦
   // | ["less", number],//[-,a] //这个可以用 in 代替, -部分足够低就可以啦
   // | ["less_average"] // 低于平均分 , 过滤高优先级
   // | ["more_average"] // 高于平均分 , 过滤高优先级
   | ["lowest"]  //尽可能寻找最低分的 , 过滤低优先级
   | ["largest"] //尽可能寻找最高分的 , 过滤低优先级
   ,
   time_range: null //时间限制 ,单位天
   | ["in", number, number] // 满足[a,b]时间区间的单词, a,b表示多少天没有遇见过,最低是0, 所以必须满足a>b ,例如 [7,0] : 范围是 7天前到现在 这个时间范围 遇到的单词
   | ["recent"] // 尽可能是最近遇到过的单词
   | ["ago"] // 尽可能是 很久没遇到过的单词
   ,
   yes_no: null // 对yes和no进行筛选 ,过滤高优先级
   | ["yes>=no"] // yes大于等于no
   | ["no>=yes"] // no 大于等于yes
   //todo:...
}

/// 过滤单词列表
/// ! 未测试,以我对自己的了解,这个函数很有可能有问题,出问题就调整这个函数!
const filter_word_list = (filter: StoreFilter, word_list: BookWordMes[]): BookWordMes[] => {
   let ret_word_list: BookWordMes[] = word_list;
   if (filter.is_star != null) {
      ret_word_list = ret_word_list.filter(mes => {
         const is_star = book_golbal.store_golbal.get_star(mes.word);
         return is_star == filter.is_star
      })
   }
   if (filter.score_range != null) {
      switch (filter.score_range[0]) {
         case "in": {
            const [_, a, b] = filter.score_range;
            ret_word_list = ret_word_list.filter(mes => (a <= mes.score && mes.score <= b))
         } break;
      }
   }
   if (filter.time_range != null) {
      switch (filter.time_range[0]) {
         case "in": {
            const [_, a, b] = filter.time_range;
            ret_word_list = ret_word_list.filter(mes => {
               const time = mes.last_time;
               const _day = day(time);
               const now_day = day(now());
               const c = now_day - _day;//多少天没遇见了
               return b <= c && c <= a
            })
         } break;
      }
   }
   if (filter.yes_no != null) {
      switch (filter.yes_no[0]) {
         case "yes>=no": {
            ret_word_list = ret_word_list.filter(mes => mes.yes >= mes.no);
         } break;
         case "no>=yes": {
            ret_word_list = ret_word_list.filter(mes => mes.no >= mes.yes);
         } break;
      }
   }

   /// filter.max_word_num==0 表示 无上限限制
   if (filter.max_word_num!=0 && ret_word_list.length > filter.max_word_num) {//返回的过滤单词量超过限制,进行 过滤低优先级 的事件,若还超过则进行随机删除
      if (filter.score_range != null && filter.time_range != null) {
         /// 当 x>y 时 希望 x排在y前面就 true 
         const sort_fn = (a: BookWordMes, b_score: boolean, b: BookWordMes, b_time: boolean) => {
            if (get_random_int(0, 1)) {///随机均衡分布
               if (a.last_time > b.last_time) {//注意:越接近于现在,time则越大
                  return b_time ? -1 : 1;
               } else if (a.last_time < b.last_time) {
                  return b_time ? 1 : -1;
               }
            }
            if (a.score > b.score) {
               return b_score ? -1 : 1;
            } else if (a.score < b.score) {
               return b_score ? 1 : -1;
            }
            // 如果 time 和 score 都相等，则保持原有顺序
            return 0;
         };
         // ! 注意 以下代码并没有经过测试,可能出现 非预期排列 问题
         switch (filter.score_range[0] + " " + filter.time_range[0]) {
            case "lowest recent": { ret_word_list = ret_word_list.sort((a: BookWordMes, b: BookWordMes) => 
               sort_fn(a, false, b, true)) } break;
            case "largest recent": { ret_word_list = ret_word_list.sort((a: BookWordMes, b: BookWordMes) => 
               sort_fn(a, true, b, true)) } break;
            case "lowest ago": { ret_word_list = ret_word_list.sort((a: BookWordMes, b: BookWordMes) => 
               sort_fn(a, false, b, false)) } break;
            case "largest ago": { ret_word_list = ret_word_list.sort((a: BookWordMes, b: BookWordMes) => 
               sort_fn(a, true, b, false)) } break;
         }
      } else if (filter.score_range != null){
         switch (filter.score_range[0]) {
            case "lowest":{ret_word_list = ret_word_list.sort((a,b)=>a.score - b.score)}break;
            case "largest":{ret_word_list = ret_word_list.sort((a,b)=>b.score - a.score)}break;
         }
      } else if (filter.time_range != null){
         switch (filter.time_range[0]){
            case "recent":{ret_word_list = ret_word_list.sort((a,b)=>b.last_time - a.last_time)}break;
            case "ago":{ret_word_list = ret_word_list.sort((a,b)=>a.last_time - b.last_time)}break;
         }
      }
      if(filter.score_range != null || filter.time_range != null){//有一个不为null,说明上面的一个if被触发,直接删除尾部元素即可
         ret_word_list.splice(filter.max_word_num)//移除后面的全部
      }else{//随机删除元素,直到数量达到正确的上限
         let i = word_list.length - filter.max_word_num;//需要删除的量
         for(;i>0;i--) {
            const index=get_random_int(0,word_list.length-1);//被删除的索引
            word_list.splice(index, 1);
         }
      }
   }
   return ret_word_list
}

/// 多个过滤器进行过滤
/// 多个过滤器并非一起过滤,而是把过滤的数组 合在一起
export const filters_word_list = (filters: StoreFilter[], word_list: BookWordMes[]): BookWordMes[] => {
   if(filters.length==0) return word_list;
   let ret_word_list:BookWordMes[] = [];
   filters.forEach(filter => {
      // 保证元素不重复
      ret_word_list = Array.from(new Set([...ret_word_list,...filter_word_list(filter, word_list)]))
   })
   return ret_word_list
}

export const filter_key = creat_key([StoreKey.Filter])

/// store_filter 的实体状态
export const store_filter:{
   value:StoreValue<{[name:string]:StoreFilter}>,
   get_filter(name:string):StoreFilter,
   set_filter(filter:StoreFilter):void,
}={
   value: new StoreValue<{[name:string]:StoreFilter}>(filter_key,()=>({}),true),//并非高频的修改,开启自动存储
   get_filter(name:string):StoreFilter{
      return this.value.value[name] 
   },
   set_filter(filter:StoreFilter):void{
      this.value.value[filter.name] = filter;
   }
}

