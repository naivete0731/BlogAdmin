<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>分类列表</span>
      </div>
      <el-table style="width: 100%" border stripe :data="cateList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="className" label="图标">
          <template v-slot="{ row }">
            <i :class="row.className"></i>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="类名"></el-table-column>
        <el-table-column prop="createAt" label="创建时间">
          <template v-slot="{ row }">
            {{ $formatDate(row.createAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
           <!-- 修改按钮 -->
           <el-tooltip :enterable="false" effect="dark" content="修改" placement="top">
          <el-button @click="showEditDialog(row._id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
        </el-tooltip>
        <!-- 删除按钮 -->
        <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
         <el-button @click="removeCateById(row._id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
        </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
     title='修改分类'
     :visible.sync="EditDialogVisible"
     width="30%"
     @close="resetFileds"
     >
     <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="EditForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="className">
          <el-input v-model="EditForm.className" placeholder="请输入类名"></el-input>
          <el-button @click="drawer = true"  style="margin-left: 16px;">点击选择图标</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="EditDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="upload()">确 定</el-button>
     </span>
      </el-dialog>

      <el-drawer
  title="图标"
  :visible.sync="drawer"
  :direction="direction"
  size="80%">
 <Icon></Icon>
</el-drawer>
  </div>
</template>

<script>
import Icon from '@/views/category/Icon.vue'

import { getAllCate, getByIdCate, updateCate, delCate } from '@/api'
export default {
  name: 'CateList',
  components: {
    Icon
  },
  data () {
    return {
      drawer: false,
      direction: 'ttb',
      cateList: [],
      EditDialogVisible: false,
      EditForm: {
        _id: '',
        title: '',
        className: ''
      },
      EditFormRules: {
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
    // 获取所有分类
    async getCate () {
      const { data: res } = await getAllCate()
      if (res.status !== 200) return this.$notify.error(res.message)
      this.cateList = res.data
    },
    async showEditDialog (id) {
      this.EditDialogVisible = true
      const { data: res } = await getByIdCate(id)
      if (res.status !== 200) return this.$notify.error(res.message)
      this.EditForm = res.data
    },
    // 关闭对话框后重置
    resetFileds () {
      this.$refs.EditFormRef.resetFields()
    },
    upload () {
      this.$refs.EditFormRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验失败')
        const { data: res } = await updateCate(this.EditForm)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.$notify.success(res.message)
        this.EditDialogVisible = false
        this.getCate()
      })
    },
    async removeCateById (id) {
      const confirmResult = await this.$confirm('此操作将导致管理员数据丢失, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await delCate(id)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.getCate()
        this.$notify.success('删除成功')
      }
    }
  },
  created () {
    this.getCate()
  }
}
</script>

<style lang="less" scoped>
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
