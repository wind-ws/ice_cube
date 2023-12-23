


type ResultMark = "Ok" | "Err";
type _Result<T, E> =
   | ["Ok", T]
   | ["Err", E];
export const ok = <T, E>(value: T): Result<T, E> => new Result<T, E>(["Ok", value]);
export const err = <T, E>(value: E): Result<T, E> => new Result<T, E>(["Err", value]);
export class Result<T, E> {
   private _value: _Result<T, E>;
   constructor(value: _Result<T, E>) {
      this._value = value;
   }
   public match<R>(ok: (value: T) => R, err: (value: E) => R): R {
      if (this._value[0] == "Ok") {
         return ok(this._value[1]);
      } else {
         return err(this._value[1]);
      }
   }
   public is_ok(): boolean {
      return this._value[0] == "Ok";
   }
   public is_err(): boolean {
      return this._value[0] == "Err";
   }

}
