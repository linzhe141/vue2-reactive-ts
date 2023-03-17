import {Dep} from './dep'
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
  dirty: boolean | undefined
  callback: Callback | undefined
  value: unknown

  // fn 就是用户监听和渲染watcher
  constructor(fn: Function, options?: Options, callback?: Callback) {
    this.id = id++
    this.getter = fn
    this.user = options?.user
    this.lazy = options?.lazy
    this.callback = callback
    this.dirty = this.lazy
    this.get()
    // 源码：当是计算属性的getter，是不执行的 默认不走依赖收集
    // 是在render函数执行中，去执行evaluate， 走依赖收集
    // this.value = this.lazy ? undefined: this.getter()
    this.value = this.getter()
  }
  get() {
    Dep.target = this
    // 这里会取值，走到defineReactive的getter
    this.getter()
    Dep.target = null
  }
  update() {
    if (this.lazy) {
      // 如果是计算属性  依赖的值变化了 就标识计算属性是脏值了
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    const oldValue = this.value
    const newValue = this.get()
    if (this.user && this.callback) {
      this.callback(newValue, oldValue)
    }
  }
  evaluate() {
    this.dirty = false
    this.value = this.getter()
    return this.value
  }
}
