import { defineStore } from 'pinia'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import router,{ commonRoutes, asyncRoutes, anyRoute} from '@/router'
import {userInfo} from '@/mock/user.ts'

import {cloneDeep} from 'lodash-es'

type resType = {
  code: number
  message?: string
  data: string
}
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}


const useUserStore = defineStore('User', {
  state: () => {
    return {
      token: GET_TOKEN(),
      hasCheckAsyncRoute: false,
      menuRoutes: commonRoutes,
      userName: ''
    }
  },
  actions: {
    async userLogin(res: resType) {
      // let res: LoginResponseData = await reqLogin(data)
      // success=>token
      // error=>error.message
      
      if (res.code === 200) {
        this.token = res.data as string
        this.userName = res.data as string
        // 持久化
        SET_TOKEN(res.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data as string))
      }
    },
    async getUserInfo() {
      if(this.userName === '') {
        this.userName = GET_TOKEN() as string
      }
      const userAsyncRoutes = filterAsyncRoute(
        cloneDeep(asyncRoutes),
        userInfo.data.routes,
      )
      console.log('userAsyncRoutes', userAsyncRoutes);
      this.menuRoutes = [...commonRoutes, ...userAsyncRoutes, ...anyRoute]
      console.log('menuRoutes', this.menuRoutes);
      
      [...userAsyncRoutes, ...anyRoute].forEach((route: any) => {
        console.log('route', route);
        router.addRoute(route)
      })
      this.hasCheckAsyncRoute = true
      return 'ok'
    },
    async userLogout() {
      const res = {
        code: 200,
        message: 'ok'
      }
      // let res = await reqLogOut()
      if (res.code === 200) {
        this.token = ''
        // this.username = ''
        // this.avatar = ''
        REMOVE_TOKEN()
      } else {
        return Promise.reject(new Error(res.message))
      }
      this.hasCheckAsyncRoute = false
    },
  }
})

export default useUserStore