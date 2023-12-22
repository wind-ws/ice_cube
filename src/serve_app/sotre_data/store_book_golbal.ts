import { GlobalWordMes } from "../word"



/// 对应的key : book:golbal
/// 用于 跨单词本共享每个单词的数据(这数据不受单词本的限制)
type StoreGolbal = {
   [word: string]: GlobalWordMes
}
