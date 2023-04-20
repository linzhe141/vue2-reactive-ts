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
    // 这个watcher是计算属性watcher
    const watcher = this.watcher
    // 缓存，如果没有重新走set，则表明dirty为false
    if (watcher.dirty) {
      // 执行完evaluate后 dirty就为false
      // 进行computed的依赖收集
      watcher.evaluate()
    }
    // TODO 源码这一行的意义是什么?
    // Dep.target 为渲染watcher
    // 当依赖项变了，computedWatcher要触发，依赖于computedWatcher的的渲染watcher也要触发
    if (Dep.target) {
      // 如何拿到对应的dep 进行依赖收集
      // watcher.depend
      // 收集渲染watcher
      watcher.deps.forEach((deps) => {
        deps.depend()
      })
    }
    return watcher.value
  }
}
