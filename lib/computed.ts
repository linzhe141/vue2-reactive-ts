import {Dep} from './dep'
import {Watcher} from './watcher'

export type NonNullableReturnType = string | number | boolean | symbol | object
export const computed = (getter: () => NonNullableReturnType) => {
  const cRef = new ComputedRefImpl(getter)
  return cRef
}

class ComputedRefImpl {
  getter: Function
  watcher: Watcher
  constructor(getter: Function) {
    this.getter = getter
    this.watcher = new Watcher(this.getter, {lazy: true})
  }
  // 就是Object.defineProperty()
  // 因为计算属性是值，是通过.value 获取的
  get value() {
    // 缓存，如果没有重新走set，则表明dirty为false
    if (this.watcher.dirty) {
      // 执行完evaluate后 dirty就为false
      return this.watcher.evaluate()
    }
    // Dep.target 为渲染watcher
    // TODO 源码这一行的意义是什么?
    if (Dep.target) {
      // this.watcher.de
    }
    return this.watcher.value
  }
}
