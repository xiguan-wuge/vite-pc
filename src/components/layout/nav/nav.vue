<template>
  <div class="nav">
    <div class="nav-left">
      <BreadCrumb />
    </div>
    <div class="nav-right">
      <Setting />
    </div>
  </div>
</template>
<script setup lang="ts">
import BreadCrumb from './breadcrumb.vue'
import Setting from './Setting.vue'
</script>

<style lang="less" scoped>
.nav {
  width: 100%;
  height: 100%;
  // background-color: pink;
  display: flex;
  align-items: center;
}
.nav-right {
  flex: 1;
  text-align: right;
}
</style>
