

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




