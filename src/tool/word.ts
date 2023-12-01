



/// 共享的单词信息 , 不区分单词本
/// 每一个单词的类型
type GlobalWordMes = {
   note:string ,// 自定义笔记
}

/// 单词本独享的信息
/// 每一个单词的类型
type BookWordMes = {
   word:string ,//单词本身
   yes:number,//正确次数,不能为负数
   no:number,//错误次数,不能为负数
   score:number,//综合评分,可以为负数, 分数的绝对值 越高增长越少, 越高也降的越多 , 越少增加的越多
   last_time:number, //上次遇到它的时间
}
/// BookWordMes 的默认值
const default_book_word_mes = (word:string):BookWordMes=>{
   const timestamp: number = Date.parse(new Date().toString());

   return <BookWordMes>{
      word:word,
      yes:0,
      no:0,
      score:0,
      last_time:timestamp
   }
}
const score_add = (score:number):number =>{
   return score
}
const score_subtract = (score:number):number =>{
   return score
}


