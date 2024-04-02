
import { random_int } from "./random";
import { day, now } from "./time";
import { store_global, store_global_fn } from "./store/book";
import { word } from "./store/book";


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
   last_time_range: null //时间限制 ,单位天
   | ["in", number, number] // [0,7] ,范围是 现在 到 7天前
   | ["recent"] // 尽可能是最近遇到过的单词
   | ["ago"] // 尽可能是 很久没遇到过的单词
   ,
   yes_no: null // 对yes和no进行筛选 ,过滤高优先级
   | ["yes>=no"] // yes大于等于no
   | ["no>=yes"] // no 大于等于yes
   ,
   // 解释一下这个过滤属性的用法:
   // 它可以赋予单词本 背单词的能力(而非复习)
   // 例如: 今天你背了20个单词(第一次遇到的单词(通过"yes=no=0"筛选))
   //    明天想回顾一下这20个单词,就可以通过这个过滤器达到,后天在回顾10个,大后天5个...(你随意调控)
   //    如果没有这个,只是用"time_range.in"进行控制,是会获取 昨天所有遇到的单词(而非 昨天第一次遇到的单词)
   first_time: null // 根据 第一次遇到单词的时间 进行筛选
   | ["in", number, number] // [0,7] ,范围是 现在 到 7天前
   // | ["recent"] // 尽可能是最近遇到过的单词
   // | ["ago"] // 尽可能是 很久没遇到过的单词
   | ["none"] // 一次也没遇见过, 即等于 0 
   // 标签过滤控制
   label:null  //todo 添加到过滤算法中
   | ["allow",string[]]
   | ["disallow",string[]]
   //todo:...
}

// export const store_setting = new StoreValue(StoreFile.Filter,default_store_setting);



const filter_word_list = (filter: StoreFilter, word_list: word.Word[]): word.Word[] => {
   const [get_global, _] = store_global.render();
   let ret_word_list: word.Word[] = word_list;
   // 先处理最高优先级
   if (filter.is_star != null) {
      ret_word_list = ret_word_list.filter(v => {
         return filter.is_star == store_global_fn.get_star(v.word);
      });
   }
   if (filter.score_range != null) {
      switch (filter.score_range[0]) {
         case "in": {
            const [_, a, b] = filter.score_range;
            ret_word_list = ret_word_list.filter(mes => (a <= mes.score && mes.score <= b))
         } break;
      }
   }
   if (filter.last_time_range != null) {
      switch (filter.last_time_range[0]) {
         case "in": {
            const [_, a, b] = filter.last_time_range;
            ret_word_list = ret_word_list.filter(mes => {
               const time = mes.last_time;
               const _day = day(time);
               const now_day = day(now());
               const c = now_day - _day;//多少天没遇见了
               return a <= c && c <= b
            })
         } break;
      }
   }
   if (filter.first_time != null) {
      switch (filter.first_time[0]) {
         case "in": {
            const [_, a, b] = filter.first_time;
            ret_word_list = ret_word_list.filter(mes => {
               const time = mes.first_time;
               const _day = day(time);
               const now_day = day(now());
               const c = now_day - _day;//多少天没遇见了
               return a <= c && c <= b
            })
         } break;
         case "none": {
            ret_word_list = ret_word_list.filter(v => {
               return v.first_time == 0;
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

   // 再处理低优先级

   // 超过最大单词量才处理低优先级
   if (filter.max_word_num != 0 && ret_word_list.length > filter.max_word_num) {

      const sort_fn = (a: word.Word, b: word.Word) => {
         const for_last_time_range = () => {
            switch (filter.last_time_range?.[0]) {
               case 'recent':
                  return b.last_time - a.last_time;
               case 'ago':
                  return a.last_time - b.last_time
            }
            return 0;
         }
         const for_score_range = () => {
            switch (filter.score_range?.[0]) {
               case 'largest':
                  return b.score - a.score;
               case 'lowest':
                  return a.score - b.score;
            }
            return 0;
         }
         if (filter.score_range != null && filter.last_time_range == null) {
            return for_score_range();
         }
         if (filter.score_range == null && filter.last_time_range != null) {
            return for_last_time_range();
         }
         if (random_int(0, 1)) {
            return for_last_time_range();
         } else {
            return for_score_range();
         }
      }
      if (filter.score_range != null || filter.last_time_range != null) {//有一个不为null,直接删除尾部元素即可
         ret_word_list = ret_word_list.sort(sort_fn);
         ret_word_list.splice(filter.max_word_num)//移除后面的全部
      } else {//随机删除元素,直到数量达到正确的上限
         let i = ret_word_list.length - filter.max_word_num;//需要删除的量
         for (; i > 0; i--) {
            const index = random_int(0, ret_word_list.length - 1);//被删除的索引
            ret_word_list.splice(index, 1);
         }
      }
   }

   return ret_word_list
}

/// 多个过滤器进行过滤
/// 多个过滤器并非一起过滤,而是把过滤的数组 合在一起
export const filters_word_list = (filters: StoreFilter[], word_list: word.Word[]): word.Word[] => {
   if (filters.length == 0) return word_list;
   let ret_word_list: word.Word[] = [];
   filters.forEach(filter => {
      // 保证元素不重复
      ret_word_list = Array.from(new Set([...ret_word_list, ...filter_word_list(filter, [...word_list])]))
   })
   return ret_word_list
}
