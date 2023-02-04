<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix header-box">
        <span>修改密码</span>
      </div>
      <el-form :model="RePwdForm" :rules="RePwdRules" ref="RePwdRef" label-width="100px">
        <el-form-item label="旧密码" prop="userPass">
          <el-input v-model="RePwdForm.userPass" placeholder="请输入初始密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="RePwdForm.newPass" placeholder="请输入最新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input v-model="RePwdForm.confirmPass" placeholder="请再次输入最新密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPwd">修改</el-button>
          <el-button @click="resetFields">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { resetPwd } from '@/api'
export default {
  name: 'RePwd',
  data () {
    const samePwd = (rule, value, callback) => {
      if (value === this.RePwdForm.userPass) {
        callback(new Error('新密码不能近期密码相同'))
      } else {
        callback()
      }
    }
    const rePwd = (rule, value, callback) => {
      if (value !== this.RePwdForm.newPass) {
        callback(new Error('确认密码与新密码不相同'))
      } else {
        callback()
      }
    }
    return {
      RePwdForm: {
        userPass: '',
        newPass: '',
        confirmPass: ''
      },
      RePwdRules: {
        userPass: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须在6-15位非空字符串', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须在6-15位非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ],
        confirmPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码长度必须在6-15位非空字符串', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' },
          { validator: rePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetPwd () {
      this.$refs.RePwdRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验错误')
        const { data: res } = await resetPwd(this.RePwdForm)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.$notify.success('修改密码成功,请重新登陆')
        this.$refs.RePwdRef.resetFields()
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        this.$router.push('/login')
      })
    },
    resetFields () {
      this.$refs.RePwdRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
