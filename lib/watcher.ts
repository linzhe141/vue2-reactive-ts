import {pushTarget, popTarget, Dep} from './dep'
import {queueWatcher} from './scheduler'
let id = 0
type Options = {
  user?: boolean
  lazy?: boolean
}
export type Callback = (newValue: unknown, oldValue: unknown) => void
export class Watcher {
  id: number
  getter: Function
  // user表示是不是用户自定义watcher
  user: boolean | undefined
  // lazy表示是不是计算属性watcher
  lazy: boolean | undefined
  // dirty表示这个watcher是否要重新进行取值操作=>computed
  dirty: boolean | undefined
  // watcher的回调
  callback: Callback | undefined
  // watch和computed getter的返回值
  value: unknown

  // 对应的deps
  deps: Dep[] = []
  depsIdMap = new Map<number, boolean>()
  // fn 就是用户监听和渲染watcher的getter
  constructor(fn: Function, options?: Options, callback?: Callback) {
    this.id = id++
    this.getter = fn
    this.user = options?.user
    this.lazy = options?.lazy
    this.callback = callback
    this.dirty = this.lazy

    // 源码：当是计算属性的getter，是不执行的 默认不走依赖收集
    // 是在render函数执行中，去执行evaluate， 走依赖收集
    // !见img和readme
    // this.get()
    this.value = this.lazy ? undefined : this.get()
  }
  // dep就是属性的dep
  addDep(dep: Dep) {
    const depId = dep.id
    const depsIdMap = this.depsIdMap
    if (!depsIdMap.get(depId)) {
      depsIdMap.set(depId, true)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {
    let value
    pushTarget(this)
    // 这里会取值，走到defineReactive的getter
    value = this.getter()
    popTarget()
    return value
  }
  update() {
    if (this.lazy) {
      // 如果是计算属性  依赖的值变化了 就标识计算属性是脏值了
      this.dirty = true
    } else {
      // 异步更新策略
      queueWatcher(this)
    }
  }
  run() {
    const oldValue = this.value
    const newValue = this.getter()
    if (this.user && this.callback) {
      this.callback(newValue, oldValue)
    }
  }
  evaluate() {
    this.dirty = false
    this.value = this.get()
    return this.value
  }
}
