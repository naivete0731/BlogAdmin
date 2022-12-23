import Vue from 'vue'
import VueRouter from 'vue-router'
import vuex from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: '/blog_admin/',
  routes
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const token = vuex.state.token
  if (token) {
    if (token && !vuex.state.userInfo.nickname) {
      vuex.dispatch('getUserInfoActions')
    }
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
