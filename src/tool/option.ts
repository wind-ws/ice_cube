

export type Option<T> =
   | ["None"]
   | ["Some", T];

export const none = <T>(): Option<T> => ["None"]
export const some = <T>(value: T): Option<T> => ["Some", value]

export const match_option = <T, R>(option: Option<T>, some: (value: T) => R, none: () => R): R => {
   if (option[0] == "Some") {
      return some(option[1]);
   } else {
      return none();
   }
}


/// ----------------------------------------------------------------
/// 测试版
namespace alpha {
   type OptionMark = "Some" | "None";
   type _Option<T> =
      | ["None"]
      | ["Some", T];
   const none = <T>(): Option<T> => new Option<T>(["None"]);
   const some = <T>(value: T): Option<T> => new Option<T>(["Some", value]);

   class Option<T> {
      private _value: _Option<T>;
      constructor(value: _Option<T>) {
         this._value = value;
      }
      public match<R>(some: (value: T) => R, none: () => R): R{
         if (this._value[0] == "Some") {//Ts的类型推断好差劲...
            return some(this._value[1]);
         } else {
            return none();
         }
      }
      public is_some():boolean { 
         return this._value[0] == "Some";
      }
      public is_none():boolean { 
         return this._value[0] == "None";
      }
      
      /// Option<T> => Option<U>
      public map<U>(f:(v:T)=>U):Option<U>{
         return this.match((v)=>{
            return new Option<U>(["Some",f(v)])
         },()=>{
            return new Option<U>(["None"])
         })
      }
   }
}




