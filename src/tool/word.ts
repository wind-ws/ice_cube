



/// 共享的单词信息 , 不区分单词本

import { get_random_int } from "./random";
import { now } from "./time";

/// 每一个单词的类型
export type GlobalWordMes = {
   word:string; // 单词本身
   note:string ,// 自定义笔记
   star:boolean,// 重点关注
}
export const default_golbal_word_mes=(word:string):GlobalWordMes=>{
   return <GlobalWordMes>{
      word:word,
      note:"",
      star:false
   }
}

/// 单词本独享的信息
/// 每一个单词的类型
export type BookWordMes = {
   word:string ,//单词本身
   yes:number,//正确次数,不能为负数
   no:number,//错误次数,不能为负数
   score:number,//综合评分,整数,可以为负数, 分数的绝对值 越高增长越少, 越高也降的越多 , 越少增加的越多
   last_time:number, //上次遇到它的时间
}
/// BookWordMes 的默认值
export const default_book_word_mes = (word:string):BookWordMes=>{
   return <BookWordMes>{
      word:word,
      yes:0,
      no:0,
      score:0,
      last_time:now()
   }
}

/// 分数越高加的越少,越低加的越多
/// 加点随机数,好玩一点
export const score_add = (score:number):number =>{
   //要求取整运算
   const f= (x:number):number=>Math.ceil(-((99)/(2000))*x +((101)/(2)));
   if(score>1000){
      return 1+get_random_int(0,2)
   } else if(score< -1000){
      return 100+get_random_int(0,100)
   }
   return f(score)+get_random_int(0,10)
}
/// 分数越高减的越多,越低减的越少
/// 注意:这个函数返回的是正数,是你应该减去的数
/// 嘻嘻,随机数多减一点
export const score_subtract = (score:number):number =>{
   //要求取整运算
   const f= (x:number):number=>Math.ceil(-((99)/(2000))*x +((101)/(2)));
   if(score>1000){
      return 100+get_random_int(0,200)
   } else if(score< -1000){
      return 1+get_random_int(0,5)
   }
   return -f(score)+101+get_random_int(0,20) 
}


