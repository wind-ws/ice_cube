/// Option 不用class ,而是改成函数式的 ,因为 序列化和反序列化 不会处理class




export type OptionMark = "Some" | "None";
export type Option<T> =
   | ["None"]
   | ["Some", T];


export const none = <T>(): Option<T> => ["None"]
export const some = <T>(value: T): Option<T> => ["Some", value];


export const option_fn = <T>(v: Option<T>) => {
   return {
      is_some(): boolean {
         return v[0] == "Some";
      },
      is_none(): boolean {
         return v[0] == "None";
      },
      unwrap(mes: string = "你应该通过逻辑确保,这个err绝对不会发生(该死,你看到这句话说明已经发生了)"): T {
         if (v[0] == "Some") {
            return v[1]
         } else {
            throw new Error("unwrap:" + mes)
         }
      },
      match<R>(some: (value: T) => R, none: () => R): R {
         if (v[0] == "Some") {
            return some(v[1]);
         } else {
            return none();
         }
      },
      /** Option<T> => T */
      match_none(none: () => T): T {
         if (v[0] == "Some") {
            return v[1];
         } else {
            return none();
         }
      },
      /** Option<T> => Option<U> */
      map<U>(f: (v: T) => U): Option<U> {
         return this.match((v) => {
            return <Option<U>>(["Some", f(v)])
         }, () => {
            return <Option<U>>(["None"])
         })
      },
      or<R>(_default: () => R): T | R {
         if (v[0] == "Some") {
            return v[1]
         } else {
            return _default()
         }
      }
   }
}

export const from_undefined = <U>(value: U | undefined): Option<U> => {
   if (value === undefined) {
      return none()
   } else {
      return some(value)
   }
}







