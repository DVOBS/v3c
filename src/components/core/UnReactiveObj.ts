function preventReactive(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    configurable : true,
    writable: true,
    enumerable: false,
  });
}

function useProp(version) {
  // do nothing
}

let uid = 0;

/**
 * ThreeJS 中的对象的封装类
 */
export default class UnReactiveObj<T> {
  public id: number;
  public type: string;
  public version: number = 0;
  private obj: T;

  constructor(obj?: T) {
    this.id = uid++;
    preventReactive(this, 'obj');
    this.set(obj);
  }

  public set(obj: T): void {
    this.obj = obj;
    this.version++;
  }

  public get(): T {
    // 因为obj被隐藏，所以其变化无法被VUE收集为依赖。由 version 代替。
    useProp(this.version);
    return this.obj;
  }
}
