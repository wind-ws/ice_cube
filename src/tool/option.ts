

type Option<T> =
   | ["None"]
   | ["Some", T];

const none = <T>(): Option<T> => ["None"]
const some = <T>(value: T): Option<T> => ["Some", value]

const match_option = <T, R>(option: Option<T>, some: (value: T) => R, none: () => R): R => {
   if (option[0] == "Some") {
      return some(option[1]);
   } else {
      return none();
   }
}


type Result<T, E> =
   | ["Ok", T]
   | ["Err", E];

const ok = <T, E>(value: T): Result<T, E> => ["Ok", value];
const err = <T, E>(value: E): Result<T, E> => ["Err", value];

const match_result = <T, E, R>(option: Result<T, E>, ok: (value: T) => R, err: (value: E) => R): R => {
   if (option[0] == "Ok") {
      return ok(option[1]);
   } else {
      return err(option[1]);
   }
}