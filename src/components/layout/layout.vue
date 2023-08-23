<template>
  <div class="layout-container">
    <el-container style="height: 100vh;">
  <el-aside
    width="200px"
  >
    <el-scrollbar>
      <el-menu
        :default-active="$route.path"
        active-text-color="#fff"
        background-color="#001529"
        text-color="#959ea6"
        :collapse="false"
        :router="true"
      >
        <Menu :menuList="userStore.menuRoutes"></Menu>
      </el-menu>
    </el-scrollbar>

  </el-aside>
  <el-container>
    <el-header>
      <Nav></Nav>
    </el-header>
    <el-main>
      <Main></Main>
    </el-main>
  </el-container>
</el-container>
  </div>

</template>

<script setup lang="ts">
import Menu from './menu.vue'
import Nav from './nav/nav.vue'
import Main from './main.vue'

import { useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const $route = useRoute()


</script>

<style lang="less">
.layout-container {
  .el-header {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  }
  .el-aside {
    background-color: #001529;
  }
}
</style>