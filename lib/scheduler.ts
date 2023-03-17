import type {Watcher} from './watcher'
let queue: Watcher[] = []
let callbacks: Function[] = []
let pending = false
const map = new Map<number, boolean>()

function flushQueue() {
  queue.forEach((watcher) => {
    watcher.run()
    const id = watcher.id
    map.set(id, false)
  })
  queue = []
}

export function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  // 去重watcher
  if (!map.get(id)) {
    map.set(id, true)
    queue.push(watcher)
    // 不管watcher的update执行多少次 ，但是最终只执行一轮刷新操作
    if (!pending) {
      pending = true
      // flushQueue()
      nextTick(flushQueue)
    }
  }
}
export function nextTick(cbk: Function) {
  callbacks.push(cbk)
  Promise.resolve().then(() => {
    pending = false
    flushCallbacks()
  })
}
function flushCallbacks() {
  // 为啥要拷贝，因为当嵌套时，顺序会出现问题
  let cbs = callbacks.slice(0)
  callbacks = []
  for (let i = 0; i < cbs.length; i++) {
    cbs[i]()
  }
}
