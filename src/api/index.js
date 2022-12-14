// 封装具体接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码}
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}