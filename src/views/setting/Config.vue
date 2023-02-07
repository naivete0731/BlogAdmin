<template>
  <div>
    <el-card>
      <div slot="header">
        <span>博客配置</span>
      </div>

      <el-form :model="ConfigForm" :rules="ConfigFormRules" ref="ConfigFormRef" label-width="100px">
        <el-form-item label="Logo">
          <img @click="chooseImg" :src="baseURL + ConfigForm.logo.replace(/^public/, '')" class="the_img" alt="图片" ref="imgSrc">
          <!-- <el-image
   style="width: 20%"
   :src="baseURL + EditForm.avatar.replace(/^public/, '')"
   :preview-src-list="srcList"
  >
</el-image> -->
          <input @change="onFileChange" type="file" accept="image/*" style="display:none" ref="iptFile">
          <!-- <i class="el-icon-upload icon-upload"></i> -->
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="ConfigForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="ConfigForm.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="博客描述" prop="describe">
          <el-input v-model="ConfigForm.describe" placeholder="请输入博客描述"></el-input>
        </el-form-item>
        <el-form-item label="评论功能">
          <el-switch
           v-model="ConfigForm.comment"
           active-text="开启"
           inactive-text="禁用"
           active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="人工审核">
          <el-switch
           v-model="ConfigForm.review"
           active-text="开启"
           inactive-text="禁用"
           active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="注册">
          <el-switch
           v-model="ConfigForm.register"
           active-text="开启"
           inactive-text="禁用"
           active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item>
            <el-button @click="upload()">保存</el-button>
        </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import { getConfig, upload, updateConfig } from '@/api'
import { baseURL } from '@/utils/request'
export default {
  name: 'ConfigBlog',
  data () {
    return {
      baseURL,
      Config: {},
      ConfigForm: {
        logo: '',
        title: '',
        keyword: '',
        describe: '',
        comment: null,
        review: null,
        register: null
      },
      ConfigFormRules: {
        title: [
          { require: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        keyword: [
          { require: true, message: '请输入关键字', trigger: 'blur' },
          { min: 2, max: 100, message: '关键字超出限制', trigger: 'blur' }
        ],
        describe: [
          { require: true, message: '请输入博客描述', trigger: 'blur' },
          { min: 2, max: 100, message: '博客描述超出限制', trigger: 'blur' }
        ]
      },
      uploadFile: {}
    }
  },
  created () {
    this.getConfig()
  },
  methods: {
    async getConfig () {
      const { data: res } = await getConfig()
      if (res.status !== 200) return this.$notify.error(res.message)
      this.ConfigForm = res.data[0]
    },
    onFileChange (e) {
      const files = e.target.files
      if (files.length !== 0) {
        this.$refs.imgSrc.setAttribute('src', URL.createObjectURL(files[0]))
        this.uploadFile = files[0]
      }
    },
    // 图片点击事件
    chooseImg () {
      this.$refs.iptFile.click()
    },
    // 保存更新
    async upload (id) {
      if (!this.uploadFile.type) {
        console.log(1)
      } else {
        const fd = new FormData()
        fd.append('file', this.uploadFile)
        const { data: res } = await upload(fd)
        if (res.status !== 201) return this.$notify.error(res.message)
        this.ConfigForm.logo = res.data.path
      }

      const { data: ress } = await updateConfig(this.ConfigForm)
      if (ress.status !== 201) return this.$notify.error(ress.message)
      this.$notify.success(ress.message)
      this.getConfig()
    }
  }
}
</script>

<style lang="less" scoped>
  .the_img {
    max-width: 40%;
  }
</style>
