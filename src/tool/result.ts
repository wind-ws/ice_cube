

/// todo 用的时候在做

type ResultMark = "Ok" | "Err";
type Result<T, E> =
   | ["Ok", T]
   | ["Err", E];
const ok = <T, E>(value: T): __Result<T, E> => new __Result<T, E>(["Ok", value]);
const err = <T, E>(value: E): __Result<T, E> => new __Result<T, E>(["Err", value]);

class __Result<T, E> {
   private _value_result: Result<T, E>;
   constructor(value: Result<T, E>) {
      this._value_result = value;
   }
   public match<R>(ok: (value: T) => R, err: (value: E) => R): R {
      if (this._value_result[0] == "Ok") {
         return ok(this._value_result[1]);
      } else {
         return err(this._value_result[1]);
      }
   }
   public is_ok(): boolean {
      return this._value_result[0] == "Ok";
   }
   public is_err(): boolean {
      return this._value_result[0] == "Err";
   }
   public unwrap():T{
      if (this._value_result[0] == "Ok") {
         return this._value_result[1]
      } else {
         throw new Error("unwrap: 你应该通过逻辑确保,这个err绝对不会发生(该死,你看到这句话说明已经发生了)")
      }
   }

}
