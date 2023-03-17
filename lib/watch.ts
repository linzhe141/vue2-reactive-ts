import {Watcher} from './watcher'
import type {Callback} from './watcher'
import type {NonNullableReturnType} from './computed'
type SourceType = () => NonNullableReturnType
export const watch = (source: SourceType, callback: Callback) => {
  new Watcher(source, {user: true}, callback)
}
