import {defineReactive} from './defineReactive'
type RefType<T> = {
  value: T
}
export const ref = <T>(value: T) => {
  return createRef(value)
}
const createRef = <T>(value: T) => {
  const ref = {} as RefType<T>
  defineReactive(ref, 'value', value)
  return ref
}
