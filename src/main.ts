import {
  Watcher,
  nextTick,
  reactive,
  watch,
  computed,
  ref,
  watchEffect,
} from '../lib/main'

const obj = reactive({
  x: 100,
  y: 200,
  z: {
    a: 1,
    b: {
      c: 1,
    },
  },
})
const refTest = ref(1)
;(window as any).__reactive_obj__ = obj
;(window as any).__ref_obj__ = refTest
// const render = () => {
//   document.body.innerHTML = `
//   <div>
//     <div id='test'>obj:x-->${JSON.stringify(obj.x)}</div>--obj:y-->${
//     obj.y
//   }--obj:z.a-->${obj.z.a}--obj:z.b.c-->${obj.z.b.c}
//   </div>
//   <div>
//     obj:x.xxxx-->${obj.x?.xxxx}--obj:y-->${obj.y}--obj:z.a-->${
//     obj.z.a
//   }--obj:z.b.c-->${obj.z.b.c}
//   </div>`
// }
const computedTest = computed(() => {
  console.log('computed change~')
  return obj.x * 2
})
const render = () => {
  // document.body.innerHTML = `
  //   <div>
  //     <div id='test'>obj:x-->${JSON.stringify(obj.x)}</div>
  //     <div id='test'>obj:y-->${obj.y}</div>
  //     <div>computedTest:-->${computedTest.value}</div>
  //   </div>
  //  `
  document.body.innerHTML = `
    <div>
      <div>refTest-->${refTest.value}</div>
      <div id='test'>obj:y-->${obj.y}</div>
      <div>computedTest:-->${computedTest.value}</div>
    </div>
   `
}
// 组件就是一个渲染watcher
new Watcher(render)

obj.x = 101
obj.x = 102
console.log('同步1', document.querySelector('#test')?.innerHTML)
nextTick(() => {
  console.log('nextTick', document.querySelector('#test')?.innerHTML)
})
console.log('同步2', document.querySelector('#test')?.innerHTML)

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

watchEffect(() => {
  console.log('watchEffect refTest', refTest.value)
})
