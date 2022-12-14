// 基于axios封装，网络请求函数
import axios from 'axios'
import vuex from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

export const baseURL = 'http://localhost:3000'
// axios.create()创建一个带配置项的自定义axios函数
const request = axios.create({
  baseURL
})

request.interceptors.request.use(config => {
  if (vuex.state.token) {
    config.headers.Authorization = vuex.state.token
  }
  // Loading.service()
  return config
}, error => {
  // 请求发起前的代码，如果有异常报错，会直接进入这个
  // 返回一个拒绝状态的Promise对象(axios留在原地的Promise对象状态就为失败结果为error变量值)
  // 此函数类似catch()里return
  // return || Promise对象值，会作为成功的结果，返回给下一个Promise对象(axios留在原地)
  // returnPromise对象，这个Promise对象状态，返回给下一个Promise对象
  // Promise.reject() 原地留下一个新的Promise对象(状态为失败) 它是Promise的类方法reject（）
  return Promise.reject(error)
  // 等同于
  /**
   * return new Promise((resolve, reject) => {
   * reject(error)
   * })
   */
})

request.interceptors.response.use(config => {
  // 响应http状态码为 2xx和3xx，时触发成功的回调，形参中的 config是"成功的结果"
  // return到axios原地Promise对象，作为成功的结果
  // Loading.close()
  return config
}, error => {
  if (error.response.status === 401) {
    // 本次响应式token过期了
    // 清除vuex里的一切，然后切换回登陆页面(被动退出登陆状态)
    vuex.commit('updateToken', '')
    vuex.commit('updateUserInfo', {})
    router.push('/login')
    Message.info('用户身份已过期,请重新登录')
  }
  return Promise.reject(error)
})
export default request
