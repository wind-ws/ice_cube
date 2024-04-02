


/// 旧格式: 
/// 一行一个单词,<note>允许换行,note和word中不允许出现'|'符号
/// <word>
/// <word>|<note>|
/// <word>|
///   <note>
/// |

/*
   没必要用一个正则表达式处理全部内容,一个一个处理也可以,以下格式没有歧义性
   新格式:
   一行一个单词
   <word>            // 单个单词
   <word> *          // star为ture
   <word> #<label>   // 添加多个标签(不可包含空格),例如: #词组 #计算机词汇
   <word> @<word>@   // 添加自定义的相似词,相似词中有空格,封闭语法
   <word> [v.爸爸]    // v.表示动词,后面接翻译,这个往往适合于词组 //todo:未完成这个分析
   <word> [爸爸]      // 表示不关心词性,会默认转到 none. //todoxx
   ! <word> ...      // 表示不进入单词本,只进行全局信息存储 //todo
*/




/// 处理多于的空格
/// example: "  ab     c ef " => "ab c ef"
const trim_spaces = (str: string): string => {
   return str.trim().replace(/\s+/g, ' ')
}

type LineParseResult = {
   word: string,
   star: boolean | null,
   label: string[],
   related_word: string[],
}

/// 解析一行字符串
/// 
const line_parse = (line_str: string): LineParseResult => {
   let word: LineParseResult["word"] = "";
   let star: LineParseResult["star"] = null;
   let label: LineParseResult["label"] = [];
   let related_word: LineParseResult["related_word"] = [];
   line_str = trim_spaces(line_str);
   const r_word = line_str.match(/^([A-Za-z\- ]+[\@\*\#]?)/g);//移除最后一个字符
   if (r_word != null) {
      word = trim_spaces(r_word[0].replace(/[\@\*\#]/, ""))
   }
   const r_star = / \*/.test(line_str);
   star = r_star ? true : null;
   const r_label = line_str.match(/\#([^ ]+)/g);//移除第一个字符
   r_label?.forEach(v => {
      label.push(v.substring(1, v.length))
   })
   const r_related_word = line_str.match(/\@([A-Za-z ]+)\@/g);//移除第一个和最后一个字符
   r_related_word?.forEach(v => {
      related_word.push(v.substring(1, v.length - 1));
   })
   return {
      word,
      star,
      label,
      related_word
   }
}


/// 解析
export const parse = (str: string): LineParseResult[] => {
   const arr: LineParseResult[] = [];
   str.split('\n').forEach(line_str => {
      if (line_str.length != 0)
         arr.push(line_parse(line_str))
   });
   const result: { [word_name: string]: LineParseResult } = {};
   // 去重 ,且 将重要信息保存
   arr.forEach(v => {
      if (result[v.word] == undefined) {
         result[v.word] = {
            word: v.word,
            star: v.star,
            label: Array.from(new Set(v.label)),
            related_word: Array.from(new Set(v.related_word)),
         }
      } else {
         if (v.star != null) {
            result[v.word].star = v.star;
         }
         if (v.label.length != 0) {
            result[v.word].label = Array.from(new Set(result[v.word].label.concat(v.label)))//去重            
         }
         if (v.related_word.length != 0) {
            result[v.word].related_word = Array.from(new Set(result[v.word].related_word.concat(v.related_word)))//去重
         }
      }
   })
   return Object.values(result);
}


