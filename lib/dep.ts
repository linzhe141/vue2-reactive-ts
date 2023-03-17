import type {Watcher} from './watcher'

let id = 0
export class Dep {
  // 源码这个target是个栈，理由见img目录，
  // 就和computedWatcher为什么在实例化进行依赖收集就对应上了
  
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
