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

// 评论管理

// 获取所有评论
export const getComment = () => {
  return request({
    url: '/api/comment',
    method: 'get'
  })
}

// 添加评论
export const AddComment = ({ author, content, post, parentCommentId, state }) => {
  const id = post
  return request({
    url: '/api/comment/' + id,
    method: 'post',
    data: {
      author: {
        nickName: author.nickName,
        email: author.email,
        page: author.page,
        avatar: author.avatar
      },
      content,
      post,
      parentCommentId,
      state
    }
  })
}
// 更新评论状态
export const UpCommentState = (id) => {
  return request({
    url: '/api/comment/' + id,
    method: 'put'
  })
}

// 获取文章内的评论
export const GetPostListComment = (id) => {
  return request({
    url: '/api/comment/' + id,
    method: 'get'
  })
}
// 删除评论
export const DelComment = (id) => {
  return request({
    url: '/api/comment/' + id,
    method: 'delete'
  })
}
// 轮播管理

// 获取所有轮播
export const GetSlide = () => {
  return request({
    url: '/api/slide',
    method: 'get'
  })
}

// 添加轮播
export const AddSlide = ({ title, image, link, author }) => {
  return request({
    url: '/api/slide',
    method: 'post',
    data: {
      title,
      image,
      link,
      author
    }
  })
}

// 删除轮播
export const DelSlide = (id) => {
  return request({
    url: '/api/slide/' + id,
    method: 'delete'
  })
}
// 博客配置

// 获取配置项
export const getConfig = () => {
  return request({
    url: '/api/settings',
    method: 'get'
  })
}

// 更新配置项
export const updateConfig = ({ logo, title, keyword, describe, comment, review, register }) => {
  return request({
    url: '/api/settings/',
    method: 'post',
    data: {
      logo,
      title,
      keyword,
      describe,
      comment,
      review,
      register
    }
  })
}
// 侧边栏模块

// 添加侧边栏
export const AddMenu = ({ title, icon, indexPath, parentMenuId }) => {
  return request({
    url: '/api/menus/',
    method: 'post',
    data: {
      title,
      icon,
      indexPath,
      parentMenuId
    }
  })
}

// 根据ID查询侧边栏信息
export const getByIdMenu = (id) => {
  return request({
    url: '/api/menus/' + id,
    method: 'get'
  })
}

// 修改侧边栏
export const updateMenu = ({ _id, title, icon, indexPath, parentMenuId }) => {
  return request({
    url: '/api/menus/' + _id,
    method: 'put',
    data: {
      title,
      icon,
      indexPath,
      parentMenuId
    }
  })
}
// 删除侧边栏
export const delMenu = (id) => {
  return request({
    url: '/api/menus/' + id,
    method: 'delete'
  })
}
