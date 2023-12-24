



type OptionMark = "Some" | "None";
type _Option<T> =
   | ["None"]
   | ["Some", T];

export const none = <T>(): Option<T> => new Option<T>(["None"]);
export const some = <T>(value: T): Option<T> => new Option<T>(["Some", value]);
export class Option<T> {
   private _value: _Option<T>;
   constructor(value: _Option<T>) {
      this._value = value;
   }
   public match<R>(some: (value: T) => R, none: () => R): R {
      if (this._value[0] == "Some") {//Ts的类型推断好差劲...
         return some(this._value[1]);
      } else {
         return none();
      }
   }
   public match_none(none: () => T): T{
      if (this._value[0] == "Some") {
         return this._value[1];
      } else {
         return none();
      }
   }
   public is_some(): boolean {
      return this._value[0] == "Some";
   }
   public is_none(): boolean {
      return this._value[0] == "None";
   }
   public expect(msg: string): T {
      if (this._value[0] == "Some") {
         return this._value[1]
      } else {
         throw new Error("expect:" + msg)
      }
   }
   public unwrap(): T {
      if (this._value[0] == "Some") {
         return this._value[1]
      } else {
         throw new Error("unwrap: 你应该通过逻辑确保,这个err绝对不会发生(该死,你看到这句话说明已经发生了)")
      }
   }
   public unwrap_or(_default: T):T{
      if (this._value[0] == "Some") {
         return this._value[1]
      } else {
         return _default
      }
   }
   public unwrap_or_else(_default: () => T): T {
      if (this._value[0] == "Some") {
         return this._value[1]
      } else {
         return _default()
      }
   }
   public or<R>(_default: () => R):T|R {
      if (this._value[0] == "Some") {
         return this._value[1]
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
}






