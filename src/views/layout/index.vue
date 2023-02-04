<template>
<el-container class="main-container">
  <el-aside :class="!isCollapse ? '': 'min-aside'">

<!-- 侧边栏区域 -->
<el-scrollbar style="height:100%">

    <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    router
    unique-opened
    :collapse-transition="false"
        mode="vertical"
    background-color="rgb(48, 65, 86)"
    text-color="rgb(191, 203, 217)"
    active-text-color="rgb(64, 158, 255)"
    >
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span>首页</span>
    </el-menu-item>
    <template v-for="item in menus">
      <el-menu-item v-if="item.items.length === 0" :index="item.indexPath" :key="item._id">
        <i class="el-icon-user-solid"></i>
        <span>{{ item.title }}</span>
      </el-menu-item>
      <el-submenu v-else :index="item._id" :key="item.createAt">
        <template slot="title">
        <i class="el-icon-user-solid"></i>
        <span>{{ item.title }}</span>
      </template>

          <el-menu-item v-for="obj, index in item.items" :index="item.indexPath + obj.indexPath" :key="index">
            <i class="el-icon-user-solid"></i>
            <span>{{ obj.title }}</span>
          </el-menu-item>
      </el-submenu>
    </template>
    </el-menu>
  </el-scrollbar>
  </el-aside>
  <el-container>
    <el-header>
    <div class="left-container" style="display:flex">
      <div class="hamburger-container" @click="isCollapse=!isCollapse"><i class="el-icon-s-fold icon-warp"></i></div>
      <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index" >
        <router-link v-if="index === 0" to="/home">
          {{ item.meta.title }}
        </router-link>
        <span v-else>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
  <!-- </transition-group> -->
      </el-breadcrumb>
    </div>
  <div class="avatar-container">

    <el-dropdown trigger="click" size="mini">
     <div>
      <el-avatar shape="square"   :src="baseURL +  UserInfo.avatar.replace(/^public/, '')"></el-avatar>
     <i class="el-icon-caret-bottom"></i>
     </div>

      <el-dropdown-menu slot="dropdown">
        <router-link to="/roleprofile/userinfo">
          <el-dropdown-item >个人中心</el-dropdown-item>
        </router-link>
        <router-link to="/home">
          <el-dropdown-item to="/home">首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="quit()">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</el-container>

</template>

<script>
import { getMenuListAPI } from '@/api'
import { mapGetters } from 'vuex'
import { baseURL } from '@/utils/request'
export default {
  name: 'LayoutVue',
  data () {
    return {
      menus: [],
      isCollapse: false,
      levelList: null,
      baseURL
    }
  },
  methods: {
    async getMenuList () {
      const { data: res } = await getMenuListAPI()
      if (res.status !== 200) return this.$message.error('侧边栏获取失败')
      this.menus = res.data
      console.log(this.$route)
    },
    getBreadcrumb () {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard (route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === '首页'.toLocaleLowerCase()
    },
    quit () {
      this.$confirm('退出登录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        this.$router.push('/login')
        this.$notify.success('退出成功')
      }).catch(() => {

      })
    }
  },
  created () {
    this.getMenuList()
    this.getBreadcrumb()
  },
  watch: {
    $route (route) {
      this.getBreadcrumb()
    }
  },
  computed: {
    ...mapGetters(['UserInfo'])
  }

}
</script>

<style lang="less" scoped>
  .main-container {
    height: 100%;
    .el-header {
      background-color: #fff;
      height: 50px !important;
      display: flex;
      line-height: 50px;
      justify-content: space-between;
      .hamburger-container {
        cursor: pointer;
        .icon-warp {
        font-size: 20px;
        cursor: pointer;
      }
      }

      .avatar-container {
        line-height:78px;
        cursor: pointer;
      }
    }
    .el-aside {
      background: rgb(48, 65, 86);
      width: 210px!important;
      // color: rgb(191, 203, 217);
      transition: all ease-in-out .2s;
    }
    .el-main {
      background: rgb(240, 242, 245);
    }
    .min-aside {
    width: 64px !important;
  }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
    min-height: 400px;
  }

  .el-menu {
    // height: 100%;
    border-right: 0;
  }

::v-deep .el-scrollbar__wrap
{
  overflow-x: hidden !important;

}
.el-breadcrumb {
  line-height: 46px;
  margin-left: 20px;
}

.fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity .5s;
  }

  .el-icon-caret-bottom {
    color: #5a5e66;
    font-size: 12px;
    margin-left: 5px;
  }
  .el-dropdown-menu {
    top: 50px !important;
  }
</style>
