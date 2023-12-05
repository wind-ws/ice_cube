

/// 获取现在的时间
export const now = (): number => new Date().getTime();

/// 获取天数
export const day = (time: number): number => {
   const day = Math.floor(time / (1000 * 60 * 60 * 24));
   return day
}



