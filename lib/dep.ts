import type {Watcher} from './watcher'

let id = 0
const targetStack: Watcher[] = []
export function pushTarget(watcher: Watcher) {
  targetStack.push(watcher)
  Dep.target = watcher
}
export function popTarget() {
  targetStack.pop()
  const length = targetStack.length
  if (length) {
    Dep.target = targetStack[length - 1]
  } else {
    Dep.target = null
  }
}
export class Dep {
  // 源码这个维护了一个watcher栈，理由见img目录，
  // 简单来说，watcher中还有可以存在嵌套的watcher，如果不是栈的话，
  // 那么target指向会存在问题
  // 就和computedWatcher为什么*不*在实例化进行依赖收集就对应上了

  static target: Watcher | null
  // id 用于watcher收集dep
  id: number
  subs: Watcher[]
  map = new Map<number, boolean>()
  constructor() {
    this.id = id++
    this.subs = []
  }
  // addSub(watcher: Watcher) {
  //   // 源码是在watcher中进行添加dep所对应watcher的
  //   // 理由见note目录
  //   if (!this.map.get(watcher.id)) {
  //     this.map.set(watcher.id, true)
  //     this.subs.push(watcher)
  //   }
  // }
  depend() {
    Dep.target?.addDep(this)
  }
  addSub(watcher: Watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}
