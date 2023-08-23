<template>
  <div class="login">
    <el-form :rules="rules" :model="loginForm" ref="form">
      <el-form-item 
        prop="userName"
      >
        <el-input
          :prefix-icon="User"
          v-model="loginForm.userName"
          cleable
          placeholder="用户名"
          size="large"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          :prefix-icon="Lock"
          show-password
          v-model="loginForm.password"
          size="large"
          placeholder="密码"
          cleable
        ></el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input
          :prefix-icon="Warning"
          show-password
          v-model="loginForm.verifyCode"
          placeholder="验证码"
          size="large"
          maxlength="4"
        >
          <template #append>
            <VerifyCode :identifyCode="identifyCode" @click="refreshCode"></VerifyCode>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          class="loading-btn"
          type="primary"
          size="default"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import VerifyCode from '@/components/VerifyCode.vue'
import {User, Lock, Warning} from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'

import {ref, reactive} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {makeCode, getTime} from '@/utils'
import useUserStore from '@/store/modules/user'

const $router = useRouter()
const $route = useRoute()

const userStore = useUserStore()


// 验证码
const identifyCode = ref(makeCode(4))
const refreshCode = () => {
  identifyCode.value = makeCode(4)
}

const loginForm =reactive({
  userName: '',
  password: '',
  verifyCode: ''
})
const userNameValidator = (rule:any, value:string, callback:Function) => {
  console.log('rule0', rule);
  
  if(value.length === 0) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}
const passwordValidator = (rule:any, value:string, callback:Function) => {
  console.log('rule1', rule);

  if(!value.length) {
    callback(new Error('请输入密码'))
  } else if(value.length < 6 || value.length >16) {
    callback(new Error('密码长度应该在6~16位之间'))
  } else {
    callback()
  }
}
const verifyCodeValidator = (rule: any, value: string, callback: Function) => {
  console.log('rule2', rule);

  if (value.length === 0) {
    callback(new Error('请输入验证码'))
  } else if (value.length < 4) {
    callback(new Error('请输入正确的验证码'))
  } else if (identifyCode.value !== value) {
    callback(new Error('请输入正确的验证码'))
  } else if (identifyCode.value === value) {
    callback()
  }
}
const rules = {
  userName: [
    {
      type: 'blur',
      validator: userNameValidator
    }
  ],
  password: [
    {
      type: 'change',
      validator: passwordValidator
    }
  ],
  verifyCode: [
    {
      type: 'blur',
      validator: verifyCodeValidator
    }
  ]
}


const loading = ref(false)
const form = ref()
async function handleLogin() {
  await form.value.validate()
  loading.value = true
  try {
    const redirect = $route.query.redirect as string
    userStore.userLogin({
      code: 200,
      data: loginForm.userName
    })
    userStore.getUserInfo()
    $router.replace({
      path: redirect || '/'
    })
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi, ${getTime()}好！`
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

</script>

<style lang="less" scoped>
.login {
  width: 400px;
  margin: 100px auto;
  :deep(.el-input-group__append, .el-input-group__prepend) {
    padding: 0;
  }
}
</style>