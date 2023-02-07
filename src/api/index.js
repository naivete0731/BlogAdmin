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

export const getMenuListAPI = () => {
  return request({
    url: '/api/menus',
    method: 'get'
  })
}

export const getPostCount = () => {
  return request({
    url: '/api/posts/count',
    method: 'get'
  })
}

export const getCateCount = () => {
  return request({
    url: '/api/category/count',
    method: 'get'
  })
}

export const getCommentCount = () => {
  return request({
    url: '/api/comment/getAllCommentsCount',
    method: 'get'
  })
}

// 获取管理员列表
export const getAdminAll = () => {
  return request({
    url: '/api/users/',
    method: 'get'
  })
}

// 根据id获取管理员信息
export const getByIdAdmin = (id) => {
  return request({
    url: '/api/users/' + id,
    method: 'get'
  })
}

// 图片上传
export const upload = (file) => {
  return request({
    url: '/api/upload',
    method: 'post',
    data: file
  })
}

/**
 * 添加管理员
 * @param {*} param0
 * @returns 对象
 */
export const addAdmin = ({ username, email, password, status, avatar, role }) => {
  return request({
    url: '/api/users',
    method: 'post',
    data: {
      username,
      email,
      password,
      status,
      avatar,
      role
    }
  })
}

// 修改管理员信息
export const updatedInfo = ({ _id, username, email, status, avatar, role }) => {
  return request({
    url: '/api/users/' + _id,
    method: 'put',
    data: {
      username,
      email,
      status,
      avatar,
      role
    }
  })
}

// 修改管理员密码
export const resetPwd = ({ userPass, newPass, confirmPass }) => {
  return request({
    url: '/api/users/password',
    method: 'put',
    data: {
      userPass,
      newPass,
      confirmPass
    }
  })
}

// 分类管理

// 删除管理员
export const delUserInfo = (id) => {
  return request({
    url: '/api/users/' + id,
    method: 'delete'
  })
}

// 添加分类
export const addCate = ({ title, className }) => {
  return request({
    url: '/api/category',
    method: 'post',
    data: {
      title,
      className
    }
  })
}

// 获取所有分类
export const getAllCate = () => {
  return request({
    url: '/api/category',
    method: 'get'
  })
}

// 根据ID查询分类
export const getByIdCate = (id) => {
  return request({
    url: '/api/category/' + id,
    method: 'get'
  })
}

// 修改分类
export const updateCate = ({ _id, title, className }) => {
  return request({
    url: '/api/category/' + _id,
    method: 'put',
    data: {
      title,
      className
    }
  })
}

// 删除分类
export const delCate = (id) => {
  return request({
    url: '/api/category/' + id,
    method: 'delete'
  })
}

// 文章管理

// 获取所有文章
export const getAllPost = ({ pagesize, pagenum, category, state }) => {
  return request({
    url: '/api/posts',
    method: 'get',
    params: {
      pagesize,
      pagenum,
      category,
      state
    }
  })
}

// 文章筛选
export const siftPost = (id, state) => {
  return request({
    url: '/api/posts/category/' + id,
    method: 'get',
    params: {
      state
    }
  })
}

// 文章删除
export const delPost = (id) => {
  return request({
    url: '/api/posts/' + id,
    method: 'delete'
  })
}

// 发布文章
export const AddPost = ({ title, state, content, category, thumbnail }) => {
  return request({
    url: '/api/posts/',
    method: 'post',
    data: {
      title,
      state,
      content,
      category,
      thumbnail
    }
  })
}

// 根据ID查询文章
export const GetByIdPost = (id) => {
  return request({
    url: '/api/posts/' + id,
    method: 'get'
  })
}

// 修改文章
export const EditPost = ({ _id, title, state, content, category, thumbnail }) => {
  return request({
    url: '/api/posts/' + _id,
    method: 'put',
    data: {
      title,
      state,
      content,
      category,
      thumbnail
    }
  })
}
