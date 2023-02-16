<template>
  <div>
    <el-card>
      <div slot="header">
        <span>评论管理</span>
        <el-button @click="showDialogComment(true)" size="small">添加评论</el-button>
      </div>
      <el-table
      :data="CommentList.records"
      style="width: 100%"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="用户名">
            <span>{{ row.author.nickName }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ row.author.email }}</span>
          </el-form-item>
          <el-form-item label="博客链接">
            <span>{{ row.author.page }}</span>
          </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="author.nickName" label="评论人"></el-table-column>
      <el-table-column prop="post.title" label="评论在"></el-table-column>
      <el-table-column prop="content" label="评论内容"></el-table-column>
      <el-table-column prop="createAt" label="评论时间">
        <template v-slot="{ row }">
          {{ $formatDate(row.createAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template v-slot="{ row }">
          <!-- <el-switch
          style="display: block"
          v-model="row.state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="批准"
          inactive-text="未通过"

          @change="UpdateState(row._id)"
          >
        </el-switch> -->
        <span @click="UpdateState(row._id)">{{ row.state === 1 ? '通过' : '未通过' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button @click="DelComment(row._id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
  <el-form :model="CommentForm" :rules="CommentFormRules" ref="CommentRef" label-width="100px">
    <el-form-item label="昵称" prop="author.nickName">
      <el-input v-model="CommentForm.author.nickName" placeholder="请输入文章标题"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="author.email">
      <el-input v-model="CommentForm.author.email" type="email" placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="博客地址">
      <el-input v-model="CommentForm.author.page" placeholder="请输入博客地址，可以为空"></el-input>
    </el-form-item>
    <el-form-item label="评论内容" prop="content">
      <!-- 富文本编辑器 -->
      <quill-editor
      v-model="CommentForm.content"
      >
      </quill-editor>
    </el-form-item>
    <el-form-item label="文章">
      <el-select v-model="CommentForm.post" placeholder="请选择文章分类">
        <el-option v-for="obj in PostList"
        :key="obj._id"
        :label="obj.title"
        :value="obj._id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="回复">
      <el-select v-model="CommentForm.parentCommentId" placeholder="请选择文章分类">
        <el-option v-for="obj in CommentList.records"
        :key="obj._id"
        :label="obj.author.nickName"
        :value="obj._id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
    <el-button type="info" @click="dialogVisible = false">取消</el-button>

    <el-button type="primary" @click="AddValid(0)">确定</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
  </div>
</template>

<script>
import { getComment, UpCommentState, DelComment, getAllPost } from '@/api'
export default {
  name: 'COmmentList',
  data () {
    return {
      CommentList: [],
      PostList: [],
      dialogVisible: false,
      CommentForm: {
        author: {
          nickName: '',
          email: '',
          page: '',
          avatar: ''
        },
        content: '',
        post: '',
        parentCommentId: '',
        state: 1
      },
      CommentFormRules: {
        author: {
          nickName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 15, min: 2, message: '名称超出范围', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '请输入正确的邮箱', trigger: 'blur' }
          ]
        },
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { max: 100, min: 1, message: '评论内容长度不符合', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getComment()
  },
  methods: {
    async getComment () {
      const { data: res } = await getComment()
      if (res.status !== 200) return this.$notify.error(res.message)
      this.CommentList = res.data
    },
    async UpdateState (id) {
      const { data: res } = await UpCommentState(id)
      if (res.status !== 200) return this.$notify(res.message)
      this.$notify.success(res.message)
      this.getComment()
    },
    async DelComment (id) {
      const confirmResult = await this.$confirm('此操作将导致评论数据丢失, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await DelComment(id)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.$notify.success(res.message)
        this.getComment()
      }
    },
    async showDialogComment (flag) {
      const { data: res } = await getAllPost({
        // 数据显示条数
        pagesize: 100,
        // 当前页
        pagenum: 1,
        category: '',
        state: null
      })
      if (res.status !== 200) return this.$notify.error(res.message)
      this.PostList = res.data.records
      if (flag) {
        this.dialogVisible = true
      }
    },
    handleClose () {

    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
