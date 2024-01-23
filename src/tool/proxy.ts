
/// 文档:
/// Reflect : https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
/// Proxy   : https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
/// 再次学习参考的文档:
/// https://www.cnblogs.com/fqh123/p/16340077.html

import { Option } from "./option";
import { Result } from "./result";

/// 创建一个具有标识的Proxy
/// #abolish : 这个方法导致log输出的不必要的内容太多,观察起来太麻烦,所以废弃
const _Proxy = new Proxy(Proxy, {
   //拦截 new 操作符，生成 Proxy 实例的时候来拦截
   construct: function (target, argumentsList) {
      //result是new Proxy()生成的原本的实例
      const result = new target(argumentsList[0], argumentsList[1]);
      //获取原本实例reslut的类型
      const originToStringTag = Object.prototype.toString.call(result).slice(1, -1).split(' ')[1]
      //改写result的[Symbol.toStringTag]属性，加上被代理的标识
      result[Symbol.toStringTag] = 'Proxy-' + originToStringTag;
      // Object.defineProperty(result,Symbol.toStringTag,{
      //    get : ()=>{
      //       return 'Proxy-' + originToStringTag
      //    }
      // })
      return result;
   },
});
/// 判断一个对象是否被Proxy代理
/// 提前是 被 _Proxy 创建的 , 正常的Proxy无法判断
/// #abolish : _Proxy被废弃
const isProxy = (obj: any) => {
   return Object.prototype.toString.call(obj) === "[object Proxy-Object]";
}
// ---------------------------

// 工具方法：判断是否是一个对象（注：typeof 数组 也等于 'object'
const isObject = (val:any) =>
   val !== null && typeof val === 'object';

// 工具方法：值是否改变，改变才触发更新 ,相等则false
const hasChanged = (value:any, oldValue:any) =>
   value !== oldValue && (value === value || oldValue === oldValue);

// 工具方法：判断当前的 key 是否是已经存在的 ,存在则true(不涉及深层对象)
const hasOwn = (val:any, key:any) => 
   Object.hasOwnProperty.call(val, key);



/// #oblish : 它影响了 Option包装,导致每次使用Option都要转换一下类型,所以这个标记类型也没必要在存在了
// export type DeepObject<T> = {
//    [K in keyof T]: T[K] extends Record<string, any> ? DeepObject<T[K]> : T[K];
// };

/// 注意: updatedObject 这个并不是 根部的对象 , 而是被修改的对象
/// 例如 : obj.a.b.c ,修改 obj.a.b.c=0 ,updateObject是对象b
export type ChangeHandler<T> = (updatedObject: T) => void;

/// obj : 需要Proxy的对象
/// onChange : 当值被修改时触发,对深层对象有用
/// ! : 重复创建proxy的性能开销 极大, 必须处理这个问题
export const createDeepProxy = <T extends object>(obj: T, onChange: ChangeHandler<T>):T => {
   const handler: ProxyHandler<T> = {
      get(target, prop, receiver) {
         const value = Reflect.get(target, prop, receiver);
         if (isObject(value)) {//深层创建Proxy
            // 目前还没有办法去处理对一个对象的属性重复创建 Proxy的方法,因为没法判断这个属性是否已经被代理了
            // 或者把这个玩意的复杂度继续提升,否则只能这样了,一点性能而已,无伤大雅
            return createDeepProxy(value as any, onChange);
         }
         return value;
      },
      set(target, prop, value, receiver) {
         // 这里不用 把 是object的value 进行 createDeepProxy ,因为有get在, a.b 会调用get的
         Reflect.set(target, prop, value, receiver);
         onChange(receiver as T);
         return true;
      },
      deleteProperty(target, prop) {
         Reflect.deleteProperty(target, prop);
         onChange(target as T);
         return true;
      },
   };
   //当Option存储后就变成普通的对象(从存储获取后没法调用Option的方法),在这里我们把它转为正常的Option
   if(Object.keys(obj).some(v=>v == "_value_option")){//true 说明obj是Option的普通对象
      const result = new Option<any>((obj as {_value_option:any})._value_option) as T;
      obj = result;
   }
   if(Object.keys(obj).some(v=>v == "_value_result")){//和上面一样,这个用来解决Result的问题
      const result = new Result<any,any>((obj as {_value_result:any})._value_result) as T;
      obj = result;
   }
   // console.warn(obj);
   
   return new Proxy(obj, handler);
}






