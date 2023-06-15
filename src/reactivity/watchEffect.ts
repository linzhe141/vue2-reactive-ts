import {Watcher} from './watcher'

export const watchEffect = (effect: Function) => {
  new Watcher(effect)
}
