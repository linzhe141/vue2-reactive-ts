import {defineReactive} from './defineReactive'
export const ref = (value: unknown) => {
  return createRef(value)
}
const createRef = (value: unknown) => {
  const ref = {}
  defineReactive(ref, 'value', value)
  return ref as any
}
