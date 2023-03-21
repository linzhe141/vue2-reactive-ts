import {defineReactive} from './defineReactive'
// TODO 目前只做了基本类型的ref
type SourceType = number | boolean | string
type RefType = {
  value: SourceType
}
export const ref = (value: SourceType) => {
  return createRef(value)
}
const createRef = (value: SourceType) => {
  const ref = {} as RefType
  defineReactive(ref, 'value', value)
  return ref
}
