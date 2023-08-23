<template>
  <div class="setting">
    <el-dropdown>
      <span class="username">
        {{ userStore.userName }}
        <el-icon class="el-icon--righst">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()

function logout() {
  userStore.userLogout()
  $router.replace({
    path: '/login',
    query: {
      redirect: $route.path
    }
  })
}

</script>

<style lang="less" scoped>
.username {
  cursor: pointer;
  outline: none;
}
</style>
