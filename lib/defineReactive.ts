import {Dep} from './dep'

export function defineReactive(
  target: Record<string, any>,
  key: string,
  value: any
) {
  const dep = new Dep()
  // 重新定义属性，还要递归 性能低
  Object.defineProperty(target, key, {
    get: function reactiveGetter() {
      if (Dep.target) {
        // dep.addSub(Dep.target)
        // watcher必须要记录对应的dep要不计算属性不好实现
        dep.depend() // 作用也是dep.addSub(Dep.target)，但是是通过watcher记录
      }
      return value
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) return
      if (!Array.isArray(newValue) && typeof newValue === 'object') {
        reactive(newValue)
      }
      value = newValue
      dep.notify()
    },
  })
}

export function reactive<T extends Record<string, any>>(obj: T) {
  for (const key in obj) {
    defineReactive(obj, key, obj[key])
    if (!Array.isArray(obj[key]) && typeof obj[key] === 'object') {
      reactive(obj[key])
    }
  }
  return obj
}
