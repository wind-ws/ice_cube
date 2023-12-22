export type Result<T, E> =
   | ["Ok", T]
   | ["Err", E];

export const ok = <T, E>(value: T): Result<T, E> => ["Ok", value];
export const err = <T, E>(value: E): Result<T, E> => ["Err", value];

export const match_result = <T, E, R>(option: Result<T, E>, ok: (value: T) => R, err: (value: E) => R): R => {
   if (option[0] == "Ok") {
      return ok(option[1]);
   } else {
      return err(option[1]);
   }
}