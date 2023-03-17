import type {Watcher} from './watcher'

let id = 0
export class Dep {
  // 源码这个target是个栈，理由见img目录，
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
  addSub(watcher: Watcher) {
    // 源码是在watcher中进行添加dep所对应watcher的
    // 理由见img目录
    if (!this.map.get(watcher.id)) {
      this.map.set(watcher.id, true)
      this.subs.push(watcher)
    }
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}
