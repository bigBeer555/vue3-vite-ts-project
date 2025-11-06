<!-- 
  1.加上 key 的作用
  每次切换路由时：上一个组件会销毁,下一个组件会重新创建,
  这样：生命周期钩子能正常触发,<transition> 动画能正常执行,页面缓存（比如 <keep-alive>）也能更精细控制。

  为了区分不同的路由实例，Vue 会根据 key 来判断是否需要缓存组件。
  如果不使用 key，Vue 会默认使用组件的 name 作为 key，
  这样即使是同一个路由组件，不同参数也会被 Vue 认为是不同实例。
  而使用 route.fullPath 作为 key，
  就可以确保不同参数的路由组件被缓存起来，提高性能。


  2.为什么用 route.fullPath？
  route.fullPath = 包含 路径 + query + hash 的完整 URL。
  举例：
  /user?id=1 → key = /user?id=1
  /user?id=2 → key = /user?id=2
  这样即使是同一个路由组件，不同参数也会被 Vue 认为是不同实例。
-->


<!-- 
如何缓存组件?
  在 Vue 中，组件缓存主要通过 <keep-alive> 实现。被缓存的组件离开时不会被销毁，
  而是走 deactivated 生命周期，回来时触发 activated，这样可以保留页面状态。

  我们可以用带插槽的router-view提供组件构造器 配合include属性 指定只缓存特定组件，但是组件必须要写好 name 属性或者也可以if else进行判断，
  也可以结合 router-view 动态缓存路由页面。必要时可以通过 :key 强制刷新组件实例。
-->
<template>
    <div id="app">
        <div class="outside">
            <!-- 提供组件扩展功能 -->
            <router-view v-slot="{ Component, route }">
              <!-- transition组件动画 -->
              <transition :name="route.meta.transition">
                <!-- keep-alive缓存组件 -->
                <keep-alive v-if="route.meta.cache">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
                <component v-else :is="Component" />

              </transition>
            </router-view>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
  };
  </script>
  <style lang="scss">
// 确保页面可以滚动
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

.outside {
  color: aqua;
  min-height: 100vh;
  .inside {
      color: #1a1a1a;
  }
}

// 页面切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// gradient 过渡动画
.gradient-enter-active,
.gradient-leave-active {
  transition: all 0.5s ease;
}

.gradient-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.gradient-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

</style>
