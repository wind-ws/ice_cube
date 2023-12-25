


type ResultMark = "Ok" | "Err";
type _Result<T, E> =
   | ["Ok", T]
   | ["Err", E];
export const ok = <T, E>(value: T): Result<T, E> => new Result<T, E>(["Ok", value]);
export const err = <T, E>(value: E): Result<T, E> => new Result<T, E>(["Err", value]);
export class Result<T, E> {
   private _value_result: _Result<T, E>;
   constructor(value: _Result<T, E>) {
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
