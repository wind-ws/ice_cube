

export const todo = (msg:string = "当前功能还未完成,就被调用") => {
   throw new Error("todo: "+msg);
}

/// app绝对不应该发生的函数
export const panic = (mas:string = "发生了意外的错误")=>{
   throw new Error("panic: "+mas);
}

