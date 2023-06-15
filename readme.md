# 🚀 基于 ts 实现简易版 Vue2 响应式系统 🚀

这是一个基于 Vue2 的响应式系统的简单实现，实现了 composition api 的几个核心 api。该实现包括了核心的 watcher、dep、以及 defineReactive，但只针对普通对象类型，不包含数组。此外，还包括了 reactive，ref，computed，nextTick，watch，watchEffect 等简易功能。

## 📦 包含内容

- `watcher`：观察者模式的实现
- `dep`：依赖收集器
- `defineReactive`：劫持对象属性的方法
- `reactive`：将普通对象转换为响应式对象
- `ref`：将基本数据类型转换为响应式数据
- `computed`：计算属性的实现
- `nextTick`：异步更新策略
- `watch`：监视响应式数据的变化
- `watchEffect`：监视响应式数据的变化，自动收集依赖

## 📝 使用方法

### `reactive`

```javascript
// 将普通对象转换为响应式对象
import {Watcher, reactive} from './reactivity'
const obj = reactive({
  x: 100,
  y: 200,
})
const updateComponent = () => {
  document.body.innerHTML = `
    <div>
      <div id='test1'>obj:x-->${JSON.stringify(obj.x)}</div>
      <div id='test2'>obj:y-->${JSON.stringify(obj.y)}</div>
    </div>
   `
}
// 组件就是一个渲染watcher
new Watcher(updateComponent)

setTimeout(() => {
  obj.x = 1 // 视图就会更新
  obj.y = 2 // 视图就会更新
}, 3000)
```

### `ref`

```javascript
// 将基本数据类型转换为响应式数据
import {Watcher, ref} from './reactivity'
const refTest = ref(1)
const updateComponent = () => {
  document.body.innerHTML = `
    <div>
      <div id='test1'>refTest.value-->${JSON.stringify(refTest.value)}</div>
    </div>
   `
}
// 组件就是一个渲染watcher
new Watcher(updateComponent)

setTimeout(() => {
  refTest.value = 100 // 视图就会更新
}, 3000)
```

### `computed`

```javascript
import {Watcher, reactive, computed} from './reactivity'
const obj = reactive({
  x: 100,
})
const double = computed(() => {
  console.log('computed change~')
  return obj.x * 2
})
const updateComponent = () => {
  document.body.innerHTML = `
    <div>
      <div id='test1'>double.value-->${JSON.stringify(double.value)}</div>
    </div>
   `
}
// 组件就是一个渲染watcher
new Watcher(updateComponent)

setTimeout(() => {
  obj.x = 200 // 视图就会更新
}, 3000)
```

### `nextTick`

```javascript
// 异步更新策略
import {Watcher, reactive, nextTick} from './reactivity'
const obj = reactive({
  x: 100,
})
const updateComponent = () => {
  document.body.innerHTML = `
    <div>
      <div id='test'>obj:x-->${JSON.stringify(obj.x)}</div>
    </div>
   `
}
// 组件就是一个渲染watcher
new Watcher(updateComponent)

obj.x = 101
obj.x = 102
console.log('同步1', document.querySelector('#test')?.innerHTML)
nextTick(() => {
  console.log('nextTick', document.querySelector('#test')?.innerHTML)
})
console.log('同步2', document.querySelector('#test')?.innerHTML)
// ! 打印先后顺序
// 同步1 obj:x--&gt;100
// 同步2 obj:x--&gt;100
// nextTick obj:x--&gt;102
```

### `watch`

```javascript
// 监视响应式数据的变化
import {
  reactive,
  watch,
  computed,
  ref,
} from './reactivity'
const obj = reactive({
  x: 100,
})
const refTest = ref(1)
const computedTest = computed(() => {
  console.log('computed change~')
  return obj.x * 2
})
watch(
  () => obj.x,
  (newValue, oldValue) => {
    console.log('obj.x change~', newValue, 'old-value', oldValue)
  }
)

watch(
  () => refTest.value,
  (newValue, oldValue) => {
    console.log('refTest.value change~', newValue, 'old-value', oldValue)
  }
)

watch(
  () => computedTest.value as any,
  (newValue, oldValue) => {
    console.log('computedTest.value change~', newValue, 'old-value', oldValue)
  }
)
setTimeout(() => {
  obj.x = 321
  refTest.value = 100
  // 依次打印
  // obj.x change~ 321 old-value 100
  // computed change~
  // computedTest.value change~ 642 old-value 200
  // refTest.value change~ 100 old-value 1
}, 3000)

```

### `watchEffect`

```javascript
// 监视响应式数据的变化，自动收集依赖
import {ref, watchEffect} from './reactivity'
const refTest = ref(1)
watchEffect(() => {
  console.log('watchEffect refTest', refTest.value)
})
setTimeout(() => {
  refTest.value = 100
  // 依次打印
  // watchEffect refTest 100
}, 3000)
```
