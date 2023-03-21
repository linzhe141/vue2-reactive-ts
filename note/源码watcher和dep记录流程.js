let reactiveData = {
  x: 1
  y: 1
}

let render = () => `<div>${reactiveData.x}---${reactiveData.y}</div>`
// watcher1=>
vm.$watch(() => reactiveData.x, (newValue) => console.log(newValue))
// watcher2 =>
vm.$watch(() => reactiveData.y, (newValue) => console.log(newValue))
// watcher3 =>

/**
 * watcher 为什么记录dep,简而言之方便清除过期依赖，还有计算属性中收集上层watcher，比如渲染watcher和自定义watcher
 * https://juejin.cn/post/6995079895470571551
 * 
 * 依赖收集流程
 * getter
 *    x:dep
 *       x:dep.subs [watcher1]
 *       watcher1.deps [x:depl
 *    y:dep
 *       y:dep.subs [watcher1]
 *       watcher1.deps [x:dep, y:dep]
 *    x:dep
 *       x:dep.subs [watcher1,watcher2]
 *       watcher1.deps [x:dep, y:dep]
 *       watcher2.deps[x:dep]
 *    y:dep
 *       y:dep.subs [watcher1, watcher3]
 *       watcher1.deps [x:dep, y:dep]
 *       watcher2.deps [x:dep]
 *       watcher3.deps [y:depl
 * 
 * 
 *  x:dep.subs [watcher1,watcher2]
 *  y:dep.subs [watcher1,watcher3]
 *  watcher1.deps [x:dep,y: dep]
 *  watcher2.deps [x:dep]
 *  watcher3.deps [y:dep]
 *  */

// 时间循环
console.log(1)
new Promise(resolve=>{
  console.log(2)
  resolve() // 必须resolve后，then才能执行
}).then(()=>{
  console.log(3)
})
setTimeout(()=> console.log(4))
console.log(5)


// TODO
let flag = ref(true)
let obj = reactive({
  x: 1,
  y: 2
})
let render = ()=>`<div>${flag.value ? 'xxxx:' + obj.x : 'yyyy:' + obj.y}</div>`

let watcher = new Watcher(render) 
/**
 * 第一次flag 为true
 * 
 * getter
 *    x:dep.subs  [watcher]
 *    watcher.deps  [x:dep]
 * 
 * 第二次flag 为false
 * getter
 *    ! old flag为true 时的数据
 *    x:dep.subs  [watcher]
 *    watcher.deps  [x:dep]
 *    ! new flag为false 时的数据
 *    y:dep.subs [watcher]
 *    ! 不做任何处理时，就添加y：dep
 *    watcher.deps [x:dep, y:dep]
 *    
 *    watcher.oldDeps [x:dep]
 *    watcher.newDeps [y:dep]
 *    ! 如果不做任何处理watcher中还是存在x的dep，则表示setter x的时候，watcher还是会更新
 *    ! 但是理论上，这些依赖收集并没有收集到x的dep，就不应该触发重新渲染
 *    ! 则应该把x：dep去清除掉
 * 
 *    见源码的 cleanupDeps方法
 *    大致流程
 *    1、
 *      如果newDeps中不存在oldDeps中的x:dep时
 *    2、
 *      x:dep调用removeSub(this)，this就是当前的渲染watcher
 *      即x:dep中去掉当前渲染watcher=> x:dep.subs []
 *      watcher.deps [y:dep]
 *      watcher.newDeps: [] 
 *   
 *    最后
 *    x:dep.subs []
 *    y:dep.subs [watcher]
 *    watcher.deps [y:dep]
 * 
 */