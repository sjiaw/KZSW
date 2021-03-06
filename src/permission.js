/** 权限控制的 （其实就是路由拦截器）登录逻辑 */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar 一个进度条的插件
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration 是否有转圈效果

const whiteList = ['/login'] // no redirect whitelist 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar 开始进度条
  NProgress.start()

  // set page title 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next() // 有用户信息
      } else {
        // 无用户信息
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login 删除token，进入登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly 在免费登录白名单，直接去
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page. 没有访问权限的其他页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar 完成进度条
  NProgress.done()
})
