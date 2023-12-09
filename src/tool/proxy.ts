
/// 文档:
/// Reflect : https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
/// Proxy   : https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy


type DeepObject<T> = {
   [K in keyof T]: T[K] extends Record<string, any> ? DeepObject<T[K]> : T[K];
};

type ChangeHandler<T> = (updatedObject: DeepObject<T>) => void;

/// obj : 需要Proxy的对象
/// onChange : 当值被修改时触发,对深层对象有用
const createDeepProxy = <T extends object>(obj: T, onChange: ChangeHandler<T>): DeepObject<T> => {
   const handler: ProxyHandler<T> = {
      get(target, prop, receiver) {
         const value = Reflect.get(target, prop, receiver);
         if (typeof value === 'object' && value !== null) {//深层创建Proxy
            return createDeepProxy(value as any, onChange);
         }
         return value;
      },
      set(target, prop, value, receiver) {
         Reflect.set(target, prop, value, receiver);
         onChange(receiver as DeepObject<T>);
         return true;
      },
   };

   return new Proxy(obj, handler) as DeepObject<T>;
}


