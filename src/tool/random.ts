

/** [min,max] */
export const random_int = (min: number, max: number): number => {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

/** true or false */
export const random_bool = ():boolean=>{
   return random_int(0,1)?true:false;
}


