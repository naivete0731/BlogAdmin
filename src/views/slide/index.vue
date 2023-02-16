<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>轮播列表</span>
        <el-button @click="ShowAddSlide" size="small">添加轮播</el-button>
      </div>
      <el-table
      :data="SlideList"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        >
      </el-table-column>
      <el-table-column
        prop="image"
        label="图片"
        >
        <template v-slot="{ row }">
         <img :src="baseURL + row.image.replace(/^public/, '')" alt="" width="20%">
        </template>
      </el-table-column>
      <el-table-column
        prop="link"
        label="轮播链接"
        >
      </el-table-column>
      <el-table-column
        prop="author.username"
        label="作者"
      >
      </el-table-column>
      <el-table-column>
        <template v-slot="{ row }">
          <el-button @click="delSlide(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <el-dialog
  title="添加轮播"
  :visible.sync="AddDialogVisible"
  width="50%"
  :before-close="handleClose">
    <el-form v-model="AddForm" :rules="AddFormRules" ref="AddFormRef" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="AddForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="轮播图片">
        <img @click="selCoverFn" class="the_img cover-img" src="../../assets/images/avatar.jpg" alt="" ref="imgRef" />
        <!-- 文件选择框,默认隐藏 -->
        <input @change="changeCoverFn" type="file" style="display: none" accept="image/*" ref="iptFileRef">
      </el-form-item>
      <el-form-item label="轮播链接" prop="link">
        <el-select v-model="AddForm.link" placeholder="请选择轮播链接">
          <el-option v-for="obj in PostList.records"
          :key="obj._id"
          :label="obj.title"
          :value="obj._id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="AddSlide">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import { GetSlide, getAllPost, upload, AddSlide, DelSlide } from '@/api'
import { baseURL } from '@/utils/request'
import imgObj from '../../assets/images/cover.jpg'
export default {
  name: 'SlideList',
  data () {
    return {
      baseURL,
      SlideList: [],
      AddDialogVisible: false,
      AddForm: {
        title: '',
        image: '',
        link: '',
        author: ''
      },
      AddFormRules: {
        title: [
          { require: true, message: '请输入轮播标题', trigger: 'blur' },
          { min: 1, max: 50, message: '轮播标题超出限制', trigger: 'blur' }
        ],
        link: [
          { require: true, message: '请选择链接', trigger: 'blur' }
        ]
      },
      PostList: [],
      uploadFile: {}
    }
  },
  created () {
    this.GetSlide()
  },
  methods: {
    // 获取所有轮播
    async GetSlide () {
      const { data: res } = await GetSlide()
      if (res.status !== 200) return this.$notify.error(res.message)
      this.SlideList = res.data
    },
    // 添加轮播
    async ShowAddSlide () {
      const { data: res } = await getAllPost({ pagesize: 50, pagenum: 1 })
      if (res.status !== 200) return this.$notify.error(res.message)
      this.PostList = res.data
      this.AddDialogVisible = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    selCoverFn () {
      this.$refs.iptFileRef.click()
    },
    changeCoverFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.AddForm.image = null
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        this.$refs.imgRef.setAttribute('src', URL.createObjectURL(files[0]))
        this.uploadFile = files[0]
      }
    },
    async AddSlide () {
      this.AddForm.author = this.$store.state.userInfo._id
      if (this.uploadFile) {
        const fd = new FormData()
        fd.append('file', this.uploadFile)
        const { data: res } = await upload(fd)
        if (res.status !== 201) return this.$notify.error(res.message)
        this.AddForm.image = res.data.path
      } else {
        return this.$notify.error('请上传图片')
      }
      const { data: res } = await AddSlide(this.AddForm)
      if (res.status !== 200) return this.$notify.error(res.message)
      this.$notify.success(res.message)
      this.GetSlide()
      this.AddDialogVisible = false
    },
    async delSlide (id) {
      const confirmResult = await this.$confirm('此操作将导致管理员数据丢失, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await DelSlide(id)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.GetSlide()
        this.$notify.success('删除成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .clearfix {
    display: flex;
    justify-content: space-between;
  }
</style>
