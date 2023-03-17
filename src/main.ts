import {Watcher, nextTick, reactive, watch, computed} from '../lib/main'

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
;(window as any).__reactive_obj__ = obj
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
  document.body.innerHTML = `
    <div>
      <div id='test'>obj:x-->${JSON.stringify(obj.x)}</div>
      <div id='test'>obj:y-->${obj.y}</div>
      <div> ${computedTest.value}</div>
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
  (newValue) => {
    console.log('obj.x change~', newValue)
  }
)
