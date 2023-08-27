import router from '@/router'
import store from '@/store'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore(store)
const loginPath = '/login'
router.beforeEach((to, from, next) => {
  const hasLogin = userStore.token && userStore.hasCheckAsyncRoute
  if (hasLogin) {
    if (to.path === loginPath) {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path === loginPath) {
      // 避免无限重定向
      next()
    } else if (!userStore.token) {
      next({
        path: loginPath,
        replace: true
      })
    } else if (!userStore.hasCheckAsyncRoute) {
      userStore.getUserInfo()
      next({ ...to, replace: true })
    } else {
      next()
    }
  }
})
