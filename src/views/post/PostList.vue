<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>文章管理</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.category" placeholder="请选择分类" size="small">
            <el-option v-for="obj in CateList" :key="obj._id"
            :label="obj.title"
            :value="obj._id"
            >
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="1"></el-option>
              <el-option label="未发布" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="choseFn" type="primary" size="small">筛选</el-button>
            <el-button @click="resetChoseFn" type="info" size="small">重置</el-button>
            <el-button v-if="multipleSelection.length !== 0"  @click="allDelBox" type="danger">批量删除</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章按钮 -->
        <el-button @click="drawer = true" type="parimar" size="small" class="btn-pub">发表文章</el-button>
      </div>

      <!-- 文章数据区域 -->
      <el-table :data="PostList" style="width: 100%" border stripe  @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="分类" prop="category.title"></el-table-column>
        <el-table-column label="发布人" prop="author.username"></el-table-column>
        <el-table-column label="发布日期" prop="createAt">
          <template v-slot="{ row }">
            {{ $formatDate(row.createAt) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state">
          <template v-slot="{ row }">
            <span v-if="row.state !== 0">已发布</span>
            <span v-else>未发布</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button size="mini" @click="EditPost(row._id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="RemovePost(row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
</el-pagination>
    </el-card>
<!-- 添加文章抽屉 -->
    <el-drawer
  title="发布文章"
  :visible.sync="drawer"
  :direction="direction"
  :before-close="handleClose"
  size="80%"
  ref="drawer"
  >
  <el-form :model="AddPostForm" :rules="AddPostFormRules" ref="AddPostRef" label-width="100px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="AddPostForm.title" placeholder="请输入文章标题"></el-input>
    </el-form-item>
    <el-form-item label="文章分类" prop="category">
      <el-select v-model="AddPostForm.category" placeholder="请选择文章分类">
        <el-option v-for="obj in CateList"
        :key="obj._id"
        :label="obj.title"
        :value="obj._id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <!-- 富文本编辑器 -->
      <quill-editor
      @blur="contentChange"
      v-model="AddPostForm.content"
      >
      </quill-editor>
    </el-form-item>
    <el-form-item label="文章封面">
       <!-- 用来显示封面的图片 -->
      <img @click="selCoverFn" src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
      <br />
       <!-- 文件选择框，默认被隐藏 -->
      <input @change="changeCoverFn" type="file" style="display: none;" accept="image/*" class="cover-img" ref="iptFileRef" />
        <!-- 选择封面的按钮 -->
      <!-- <el-button type="text" @click="selCoverFn">+ 选择封面</el-button> -->
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="AddValid(1)" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>

    <el-button type="info" @click="AddValid(0)">存为草稿</el-button>
    </el-form-item>
  </el-form>
</el-drawer>

  <!-- 修改文章对话框 -->
  <el-dialog
     title='修改文章'
     :visible.sync="EditDialogVisible"
     width="80%"
     @close="resetFileds"
     >
     <el-form :model="EditPostForm" :rules="AddPostFormRules" ref="EditPostRef" label-width="100px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="EditPostForm.title" placeholder="请输入文章标题"></el-input>
    </el-form-item>
    <el-form-item label="文章分类" prop="category">
      <el-select v-model="EditPostForm.category._id" placeholder="请选择文章分类">
        <!-- <el-option
        :label="EditPostForm.category.title"
        :value="EditPostForm.category._id"
        ></el-option> -->
        <el-option v-for="obj in CateList"
        :key="obj._id"
        :label="obj.title"
        :value="obj._id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <!-- 富文本编辑器 -->
      <quill-editor
      @blur="EditcontentChange"
      v-model="EditPostForm.content"
      >
      </quill-editor>
    </el-form-item>
    <el-form-item label="文章封面">
       <!-- 用来显示封面的图片 -->
       <img v-if="!EditPostForm.thumbnail" @click="selCoverFn" class="the_img cover-img" src="../../assets/images/avatar.jpg" alt="" ref="imgsRef" />
          <img v-else :src="baseURL + EditPostForm.thumbnail.replace(/^public/, '')" @click="selCoverFn" class="the_img cover-img" alt="图片" ref="imgsRef">
      <br />
       <!-- 文件选择框，默认被隐藏 -->
      <input @change="EditchangeCoverFn" type="file" style="display: none;" accept="image/*" ref="iptFileRef" />
        <!-- 选择封面的按钮 -->
      <!-- <el-button type="text" @click="selCoverFn">+ 选择封面</el-button> -->
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="EditValid(1)" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
    <el-button type="info" @click="EditValid(0)">存为草稿</el-button>
    </el-form-item>
  </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { getAllPost, getAllCate, delPost, upload, AddPost, GetByIdPost, EditPost } from '@/api'
import imgObj from '../../assets/images/cover.jpg'
import { baseURL } from '@/utils/request'
export default {
  name: 'PostList',
  data () {
    return {
      baseURL,
      // 查询条件
      q: {
        // 数据显示条数
        pagesize: 5,
        // 当前页
        pagenum: 1,
        category: '',
        state: null
      },
      total: 0,
      // 文章列表
      PostList: [],
      // 分类列表
      CateList: [],
      multipleSelection: [],
      // 发表文章抽屉开关
      drawer: false,
      // 抽屉运动方向
      // ltr从左往右开
      // rtl从右往左开
      // ttb从上往下开
      // btt从下往上开
      direction: 'ltr',
      loading: false,
      timer: null,
      // 发表文章表单
      AddPostForm: {
        title: '',
        state: null,
        content: '',
        category: '',
        thumbnail: null
      },
      AddPostFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择文章标题', trigger: 'blur' }
        ],
        content: [
          // 为何这个输入内容了，校验不会去掉
          // 原因：
          // content对应quill-editor富文本编辑器，他不是el提供表单标签
          // el-input等输入框的在blur事件进行校验
          // 下拉菜单，单选框，复选框，实在change事件进行校验
          // quill-editor2个事件都没有，所以你输入内容也不会自己走校验
          // 解决：
          // 自己来给quill-editor绑定change事件
          // 在事件处理函数中用el-form组件对象内，调用某个校验规则再重新执行

          { required: true, message: '请输入文章内容', trigger: 'change' }
        ]
      },
      uploadFile: {},
      // 修改文章开关
      EditDialogVisible: false,
      EditPostForm: {
        title: '',
        state: null,
        content: '',
        category: '',
        thumbnail: null
      }

    }
  },
  created () {
    this.getPost()
    this.getCate()
  },
  methods: {
    // 获取所有文章
    async getPost () {
      const { data: res } = await getAllPost(this.q)
      if (res.status !== 200) return this.$notify.error(res.message)
      this.PostList = res.data.records
      this.total = res.data.total
    },
    // 获取所有分类
    async getCate () {
      const { data: res } = await getAllCate()
      if (res.status !== 200) return this.$notify.error(res.message)
      this.CateList = res.data
    },
    // 文章筛选
    async choseFn () {
      console.log(this.q)
      this.q.pagenum = 1
      this.q.pagesize = 5
      // const { data: res } = await siftPost(this.q.cate_id, this.q.state)
      // if (res.status !== 200) return this.$message.error(res.message)
      this.getPost()
      // this.PostList = res.data
    },
    resetChoseFn () {
      this.q.state = null
      this.q.category = ''
      this.q.pagenum = 1
      this.q.pagesize = 5
      this.getPost()
    },
    async RemovePost (id) {
      const confirmResult = await this.$confirm('此操作将导致管理员数据丢失, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await delPost(id)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.$notify.success(res.message)
        this.getPost()
      }
    },
    handleSizeChangeFn (newPageSize) {
      this.q.pagesize = newPageSize
      this.q.pagenum = 1
      this.getPost()
    },
    handleCurrentChangeFn (newPageNum) {
      this.q.pagenum = newPageNum
      this.getPost()
    },
    // 多选框触发事件
    handleSelectionChange (val) {
      this.multipleSelection = val.map((item) => item._id)
    },
    // 批量删除
    allDelBox () {
      this.RemovePost(this.multipleSelection.join('-'))
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.AddPostRef.resetFields()
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
        this.AddPostForm.thumbnail = null
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        this.AddPostForm.thumbnail = files[0]
        // 把图片文件，要显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
        this.uploadFile = files[0]
      }
      // 让表单单独校验封面的值
      // this.$refs.AddPostRef.validateField('thumbnail')
    },
    EditchangeCoverFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.EditPostForm.thumbnail = null
        this.$refs.imgsRef.setAttribute('src', imgObj)
      } else {
        this.EditPostForm.thumbnail = files[0]
        // 把图片文件，要显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgsRef.setAttribute('src', url)
        this.uploadFile = files[0]
      }
    },
    contentChange () {
      // 目标：如何让el-form校验，只校验content这个规则？
      this.$refs.AddPostRef.validateField('content')
    },
    EditcontentChange () {
      this.$refs.EditPostRef.validateField('content')
    },
    EditValid (state) {
      this.$refs.EditPostRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验未通过')
        this.PostFn(state, true)
      })
    },
    AddValid (state) {
      this.$refs.AddPostRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验未通过')
        this.PostFn(state, false)
      })
    },
    async PostFn (state, isEdit) {
      if (this.loading) {
        return
      }
      this.loading = true
      this.timer = setTimeout(() => {
        // 动画关闭需要一定的时间
        setTimeout(() => {
          this.loading = false
          this.drawer = false
        }, 400)
      }, 2000)
      if (isEdit) {
        // console.log(typeof this.EditPostForm.thumbnail !== typeof 'String')
        if (typeof this.EditPostForm.thumbnail !== typeof 'String') {
          const fd = new FormData()
          fd.append('file', this.EditPostForm.thumbnail)
          const { data: res } = await upload(fd)
          if (res.status !== 201) return this.$notify.error('头像上传失败')
          this.EditPostForm.thumbnail = res.data.path
        }
      } else {
        // if (!this.AddPostForm.thumbnail.type) {
        //   console.log('没有属性')
        // } else {
        const fd = new FormData()
        fd.append('file', this.AddPostForm.thumbnail)
        const { data: res } = await upload(fd)
        if (res.status !== 201) return this.$notify.error('头像上传失败')
        this.AddPostForm.thumbnail = res.data.path
        // }
      }

      if (isEdit) {
        const { data: res } = await EditPost(this.EditPostForm)
        if (res.status !== 200) return this.$notify.error('修改信息失败')
        this.$notify.success('修改成功')
        this.EditDialogVisible = false
        this.getPost()
      } else {
        this.AddPostForm.state = state
        const { data: res } = await AddPost(this.AddPostForm)
        if (res.status !== 201) return this.$notify.error('创建管理员失败' + res.message)
        this.$notify.success('创建成功')
        this.drawer = false
        this.getPost()
      }
    },
    cancelForm () {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },
    resetFileds () {
      this.$refs.EditPostRef.resetFields()
      this.EditPostForm.thumbnail = null
      this.EditPostForm.author = null
      this.EditPostForm.createAt = null
    },
    // 编辑对话框
    async EditPost (id) {
      const { data: res } = await GetByIdPost(id)
      if (res.status !== 200) return this.$notify.error(res.message)
      this.EditDialogVisible = true
      this.$nextTick(() => {
        this.EditPostForm = res.data
        this.EditPostForm._id = res.data._id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
::v-deep .ql-editor {
  min-height: 300px;
}
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
  cursor: pointer;
}
</style>
