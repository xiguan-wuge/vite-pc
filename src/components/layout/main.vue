<template>
  <div class="main">
    <!-- 路由组件出口位置 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div :key="$route.path">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style lang="less" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
