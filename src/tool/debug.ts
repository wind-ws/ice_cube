


export const debug_time_record = (name: string = "署名") => {
   const time = {
      name: name,
      ms: 0,//毫秒
      id: setInterval(() => {}, 10000),
      init(name: string = "署名") {//重新计时,进行初始化
         clearInterval(time.id);
         time.name = name;
         time.ms = 0;
      },
      start() {
         clearInterval(time.id);
         time.id = setInterval(() => {
            time.ms++;
         }, 100)
      },
      stop() {
         clearInterval(time.id);
      },
      log(mes:string="") {
         //warn更加方便查看调用堆栈
         console.warn(`${mes}\n时间消耗<${time.name}> : ${time.ms}ms`);
      },
   }
   return time;
}
export const debug_time = debug_time_record();

function getStackTrace() {
   return new Error().stack
}


