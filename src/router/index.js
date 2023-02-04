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
        component: () => import('@/views/home'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/roleprofile',
    meta: { title: '用户管理' },
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'adduser',
        component: () => import('@/views/roleprofile/AddUser'),
        meta: { title: '添加管理员' }
      },
      {
        path: 'userlist',
        component: () => import('@/views/roleprofile/UserList'),
        meta: { title: '管理员列表' }
      },
      {
        path: 'repwd',
        component: () => import('@/views/roleprofile/RePwd'),
        meta: { title: '修改密码' }
      }
    ]
  },
  {
    path: '/category',
    meta: { title: '分类管理' },
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'addcate',
        component: () => import('@/views/category/AddCate'),
        meta: { title: '添加分类' }
      },
      {
        path: 'catelist',
        component: () => import('@/views/category/CateList'),
        meta: { title: '分类列表' }
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

// const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const token = vuex.state.token
  if (token) {
    // if (token && !vuex.state.userInfo.nickname) {
    //   vuex.dispatch('getUserInfoActions')
    // }
    next()
  } else {
    // if (whiteList.includes(to.path)) {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
