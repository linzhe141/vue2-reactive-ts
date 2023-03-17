import {Dep} from './dep'

export function defineReactive(
  target: Record<string, any>,
  key: string,
  value: any
) {
  const dep = new Dep()
  Object.defineProperty(target, key, {
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return value
    },
    set: function reactiveSetter(newValue) {
      if (!Array.isArray(newValue) && typeof newValue === 'object') {
        reactive(newValue)
      }
      value = newValue
      dep.notify()
    },
  })
}

export function reactive(obj: Record<string, any>) {
  for (const key in obj) {
    defineReactive(obj, key, obj[key])
    if (!Array.isArray(obj[key]) && typeof obj[key] === 'object') {
      reactive(obj[key])
    }
  }
  return obj
}
