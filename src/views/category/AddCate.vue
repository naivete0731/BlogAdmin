<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix header-box">
        <span>添加分类</span>
      </div>
      <el-form :model="CateForm" :rules="CateRules" ref="CateRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="CateForm.title" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="类名" prop="className">
          <el-input v-model="CateForm.className" placeholder="请输入分类类名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPwd">添加</el-button>
          <el-button @click="drawer = true"  style="margin-left: 16px;">点击选择图标</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-drawer
  title="图标"
  :visible.sync="drawer"
  :direction="direction"
  :before-close="handleClose"
  size="80%">
 <Icon></Icon>
</el-drawer>
  </div>
</template>

<script>
import { addCate } from '@/api'
import Icon from '@/views/category/Icon.vue'
export default {
  name: 'AddCate',
  data () {
    return {
      drawer: false,
      direction: 'ttb',
      CateForm: {
        title: '',
        className: ''
      },
      CateRules: {
        title: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9-_]{1,55}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetPwd () {
      this.$refs.CateRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验错误')
        const { data: res } = await addCate(this.CateForm)
        if (res.status !== 201) return this.$notify.error(res.message)
        this.$notify.success('添加分类成功')
        this.$refs.CateRef.resetFields()
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  },
  components: {
    Icon
  }
}
</script>

<style lang="less" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
::v-deep .icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0!important;
    border: 1px solid #eaeefb;
    border-radius: 4px;
}
::v-deep [class*=" icon-"], [class^=icon-] {
    font-family: icomoon!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
::v-deep .icon-list li {
    float: left;
    width: 16.66%;
    text-align: center;
    height: 120px;
    line-height: 120px;
    color: #666;
    font-size: 13px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
}
::v-deep .icon-list li i {
    display: block;
    font-size: 32px;
    // margin-bottom: 15px;
    margin-top: 18px;
    color: #606266;
    transition: color .15s linear;
}
::v-deep .icon-list li span {
    line-height: normal;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    color: #99a9bf;
    transition: color .15s linear;
}
</style>
