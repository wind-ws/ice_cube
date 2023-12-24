



type OptionMark = "Some" | "None";
type _Option<T> =
   | ["None"]
   | ["Some", T];

export const none = <T>(): Option<T> => new Option<T>(["None"]);
export const some = <T>(value: T): Option<T> => new Option<T>(["Some", value]);

/// todo : 有问题, 存储Option后,从存储加载的Option没有方法调用,也就是加载后是普普通通的对象而已,而非Option
export class Option<T> {
   public _value_option: _Option<T>;
   constructor(value: _Option<T>) {
      this._value_option = value;
   }
   public match<R>(some: (value: T) => R, none: () => R): R {
      if (this._value_option[0] == "Some") {//Ts的类型推断好差劲...
         return some(this._value_option[1]);
      } else {
         return none();
      }
   }
   public match_none(none: () => T): T{
      if (this._value_option[0] == "Some") {
         return this._value_option[1];
      } else {
         return none();
      }
   }
   public is_some(): boolean {
      return this._value_option[0] == "Some";
   }
   public is_none(): boolean {
      return this._value_option[0] == "None";
   }
   public expect(msg: string): T {
      if (this._value_option[0] == "Some") {
         return this._value_option[1]
      } else {
         throw new Error("expect:" + msg)
      }
   }
   public unwrap(): T {
      if (this._value_option[0] == "Some") {
         return this._value_option[1]
      } else {
         throw new Error("unwrap: 你应该通过逻辑确保,这个err绝对不会发生(该死,你看到这句话说明已经发生了)")
      }
   }
   public unwrap_or(_default: T):T{
      if (this._value_option[0] == "Some") {
         return this._value_option[1]
      } else {
         return _default
      }
   }
   public unwrap_or_else(_default: () => T): T {
      if (this._value_option[0] == "Some") {
         return this._value_option[1]
      } else {
         return _default()
      }
   }
   public or<R>(_default: () => R):T|R {
      if (this._value_option[0] == "Some") {
         return this._value_option[1]
      } else {
         return _default()
      }
   }

   /// Option<T> => Option<U>
   public map<U>(f: (v: T) => U): Option<U> {
      return this.match((v) => {
         return new Option<U>(["Some", f(v)])
      }, () => {
         return new Option<U>(["None"])
      })
   }

   public static from_undefined<U>(value:U|undefined):Option<U> {
      if (value === undefined){
         return none()
      }else {
         return some(value)
      }
   }
}






