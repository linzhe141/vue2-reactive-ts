# 1、源码 Dep 的静态属性 target 为什么是栈

![](./img/%E5%B5%8C%E5%A5%97watcher.jpg)

- 源中的计算属性的依赖收集没有在实例化时进行，而是在 render 函数执行时，在进行依赖收集
- 比如当渲染 watcher 进行依赖收集时，首先 obj.y 的 dep 先收集当前渲染 watcher
  当走到计算属性 watcher 时，计算属性 value 的 getter 函数中的 Dep.target 为渲染 watcher

  ```javascript
  // 源码
  function computedGetter() {
    // 计算属性的getter的watcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        // 源码这里才是第一次做计算属性的*依赖obj.x*的依赖收集,执行watcher的get方法
        // 执行完后 还是处于渲染watcher的执行render方法中
        watcher.evaluate()
      }
      // 这里的target为渲染watcher
      if (Dep.target) {
        // 把渲染watcher添加到依赖dep的sub数组里
        // 这样当依赖obj.x进行setter时，渲染watcher和计算watcher都会被通知
        watcher.depend()
      }
      return watcher.value
    }
  }
  ```
