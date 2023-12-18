

/// 获取现在的时间
export const now = (): number => new Date().getTime();

/// 获取天数
export const day = (time: number): number => {
   const day = Math.floor(time / (1000 * 60 * 60 * 24));
   return day
}

/// 获取年月日
export const get_ymd = (time: number): string => {
   const date = new Date(time);

   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从 0 开始的，需要加 1
   const day = String(date.getDate()).padStart(2, '0');

   return `${year}-${month}-${day}`;
}

/// 获取 time 和 现在 差多少天
export const get_differ_days = (time:number):number => {
   return day(now()) - day(time)
}


