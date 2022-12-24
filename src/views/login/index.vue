<template>
  <div class="body">
    <div class="bgc"></div>
      <div class="main-box">
<!-- <transition name="fade" mode="out-in">
  <div v-if="isLogin" key="显示">显示</div>
  <div v-else key="英寸">隐藏</div>
</transition> -->
<transition name="fade" mode="out-in">
          <h1 v-if="isLogin">Sign in to system</h1>
          <div style="text-align:center;" v-else><h1>Welcome Back !</h1><br/><p style="color: #a0a5a8; font-size:14px;">To keep connected with us please login <br> with your personal info</p></div>
          </transition>
           <el-row>
                <!--两个参数代表着响应尺寸-->
                 <el-col :lg="24" :xl="24">
                  <transition name="fade" mode="out-in">
                  <el-form v-if="isLogin" :model="loginForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
         <el-form-item prop="username" label-width="0">
           <el-input v-model="loginForm.username" placeholder="请输入令牌"></el-input>
         </el-form-item>
         <el-form-item prop="password" label-width="0">
          <el-input v-model="loginForm.password" placeholder="请输入密钥" show-password ></el-input>
         </el-form-item>
         <el-button type="primary" @click="submitForm()" style="width:100%">立即登陆</el-button>
         </el-form>
                <div v-else>
                  <el-button type="primary" @click="isLogin=true" style="width:100%">前往登陆</el-button>
                </div>
              </transition>
                    </el-col>
          </el-row>

        </div>

  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入令牌', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '令牌长度不符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密钥', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密钥长度不符', trigger: 'blur' }
        ]
      },
      isLogin: false
    }
  },
  computed: {
    ...mapGetters(['getToken'])
  },
  methods: {
    // 咉射
    ...mapMutations(['updateToken', 'updateUserInfo']),
    submitForm () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return this.$message.error('登陆格式错误')
        if (this.getToken !== null) {
          this.$router.push('/')
          return this.$message.info('不能重复登陆')
        }
        const { data: res } = await loginAPI(this.loginForm)
        if (res.status !== 200) return this.$message.error(res.message)
        this.$notify.success(res.message)
        this.updateToken(res.token)
        this.updateUserInfo(res.data)
        this.$router.push('/')
      })
    }
  },
  name: 'LoginVue'
}
</script>

<style lang="less" scoped>

 /* 1. 超小屏幕下  小于 768  布局容器的宽度为 100% */
//  @media screen and (max-width: 767px) {
//         html {
//               font-size: 12px;
//             }
//         .main-box {
//           width: 100% !important;
//         }
//         }
//         /* 2. 小屏幕下  大于等于768  布局容器改为 750px */
//         @media screen and (min-width: 768px) {
//           html {
//               font-size: 40px;
//             }
//         }
//         /* 3. 中等屏幕下 大于等于 992px   布局容器修改为 970px */
//         @media screen and (min-width: 992px) {
//           html {
//               font-size: 50px;
//             }
//         }
//         /* 4. 大屏幕下 大于等于1200 布局容器修改为 1170 */
//         @media screen and (min-width: 1200px) {
//             html {
//               font-size: 60px;
//             }
//         }
  .bgc {
    background: url('@/assets/images/loginBgc.jpg');
    width: 100%;
    height: 100vh;
    // backdrop-filter: blur(1px);
    // filter: blur(2px)
  }
  .main-box {
    // width: 8rem;
    // height: 10rem;
    width: 400px;
    height: 600px;
    background: pink;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items:center;
    border-radius: 10px;
    background-color: #ecf0f3;
    opacity: .9;
  // box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  }
  .el-row {
    width: 75%;
  }
    .fade-enter,
  .fade-leave-to{
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity .5s;
  }
</style>
