import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token: '',
    userInfo: {}
  },
  getters: {
    getToken (state) {
      return state.token
    },
    nickname: state => state.userInfo.nickname,
    UserInfo: state => state.userInfo
  },
  mutations: {
    // 2. 更新 token 的 mutations函数
    updateToken (state, newToken) {
      state.token = newToken
    },
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState() // 添加持久化插件
  ]
})
