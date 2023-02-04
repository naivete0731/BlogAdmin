<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix header-box">
        <span>管理员列表</span>
        <el-button type="primary" size="mini" @click="showAddDialog">添加管理员</el-button>
      </div>
      <el-table style="width: 100%" border stripe :data="adminList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="65%">
          <template v-slot="scope">
            <el-avatar v-if="scope.row.avatar" shape="square"   :src=" baseURL  +  scope.row.avatar.replace(/^public/, '')"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色">
          <template v-slot="{ row }">
            {{ row.role === 'superadmin' ? '超级管理员' : '管理员' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="{ row }">
            {{ row.status === 1 ? '激活' : '未激活' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间">
          <template v-slot="scope">
            {{ $formatDate(scope.row.createTime) }}
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
         <el-button @click="removeUserById(row._id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
        </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加管理员对话框
    <el-dialog
     title="添加管理员"
     :visible.sync="AddDialogVisible"
     width="30%"
     @close="resetFileds"
    >
    <el-form :model="AddForm" :rules="AddFormRules" ref="AddFormRef" label-width="100px">
      <el-form-item label="头像"></el-form-item>
    </el-form>
    </el-dialog> -->

    <!-- 修改管理员信息对话框 -->
    <el-dialog
     :title="isEdit ? '修改管理员' : '添加管理员'"
     :visible.sync="EditDialogVisible"
     width="30%"
     @close="resetFileds"
     >
     <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
        <el-form-item label="头像">
          <img v-if="!EditForm.avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" ref="imgSrc" />
          <img v-else :src="baseURL + EditForm.avatar.replace(/^public/, '')" class="the_img" alt="图片" ref="imgSrc">
          <!-- <el-image
   style="width: 20%"
   :src="baseURL + EditForm.avatar.replace(/^public/, '')"
   :preview-src-list="srcList"
  >
</el-image> -->
          <input @change="onFileChange" type="file" accept="image/*" style="display:none" ref="iptFile">
          <!-- <i class="el-icon-upload icon-upload"></i> -->
          <el-button @click="chooseImg" type="warning" round style="vertical-align: text-bottom;margin-left: 50%;">更换头像</el-button>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="EditForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="EditForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="EditForm.role" placeholder="请选择角色" style="width: 100%;">
            <el-option v-for="obj in RoleList"
            :key="obj.role"
            :label="obj.name"
            :value="obj.role"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="EditForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option v-for="obj in RoleState"
            :key="obj.state"
            :label="obj.name"
            :value="obj.state"
            ></el-option>
          </el-select>
        </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
       <el-button @click="EditDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="upload()">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseURL } from '@/utils/request'
import { getAdminAll, getByIdAdmin, upload, addAdmin, updatedInfo, delUserInfo } from '@/api'
export default {
  name: 'UserList',
  data () {
    return {
      adminList: [],
      baseURL,
      EditDialogVisible: false,
      isEdit: false,
      EditForm: {
        avatar: '',
        username: '',
        email: '',
        role: 'user',
        status: 1,
        _id: ''
      },
      // 修改管理员信息校验
      EditFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 10, message: '账号长度在2~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6~20个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '角色不能为空', trigger: 'blur' },
          { pattern: /^(admin|superadmin|user)$/, message: '角色不存在', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' },
          { pattern: /^(0|1)$/, message: '状态不存在', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ]
      },
      RoleList: [
        { role: 'superadmin', name: '超级管理员' },
        { role: 'admin', name: '管理员' },
        { role: 'user', name: '用户' }
      ],
      RoleState: [
        { state: 1, name: '激活' },
        { state: 0, name: '未激活' }
      ],
      uploadFile: {},
      AddDialogVisible: false
    }
  },
  created () {
    this.getAdmin()
  },
  methods: {
    addAdminShowDialog () {
      this.AddDialogVisible = true
    },
    // 获取管理员列表
    async getAdmin () {
      const { data: res } = await getAdminAll()
      if (res.status !== 200) return this.$notify.error(res.message)
      this.adminList = res.data
    },
    async showAddDialog () {
      this.EditDialogVisible = true
      this.isEdit = false
    },
    // 显示编辑对话框
    async showEditDialog (id) {
      this.isEdit = true
      this.EditDialogVisible = true
      const { data: res } = await getByIdAdmin(id)
      if (res.status !== 200) return this.$notify.error(res.message)
      this.EditForm = res.data
      console.log(res.data)
    },
    // 更新头像点击事件
    chooseImg () {
      this.$refs.iptFile.click()
    },
    // 文件上传时间
    onFileChange (e) {
      const files = e.target.files
      if (files.length === 0) {
        // 证明没有选择文件
      } else {
        // 选择了文件
        this.$refs.imgSrc.setAttribute('src', URL.createObjectURL(files[0]))
        this.uploadFile = files[0]
      }
    },
    // 更新修改数据
    upload () {
      this.$refs.EditFormRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验未通过')
        if (!this.uploadFile.type) {
          console.log('没有属性')
        } else {
          const fd = new FormData()
          fd.append('file', this.uploadFile)
          const { data: res } = await upload(fd)
          if (res.status !== 201) return this.$notify.error('头像上传失败')
          this.EditForm.avatar = res.data.path
        }
        if (this.isEdit) {
          const { data: resd } = await updatedInfo(this.EditForm)
          if (resd.status !== 201) return this.$notify.error('修改信息失败')
          this.$notify.success('修改成功')
          this.EditDialogVisible = false
          this.getAdmin()
          this.$store.dispatch('getUserInfoActions')
        } else {
          const { data: resd } = await addAdmin(this.EditForm)
          if (resd.status !== 201) return this.$notify.error('创建管理员失败' + resd.message)
          this.$notify.success('创建成功')
          this.EditDialogVisible = false
          this.getAdmin()
        }
      })
    },
    // 编辑对话框关闭时间
    resetFileds () {
      this.$refs.EditFormRef.resetFields()
      this.EditForm = {
        status: 1
      }
    },
    // 删除对话框
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将导致管理员数据丢失, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await delUserInfo(id)
        if (res.status !== 201) return this.$notify.error(res.message)
        this.getAdmin()
        this.$notify.success('删除成功')
      }
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
  .the_img {
    width: 20%;
  }
  ::v-deep .icon-upload {
    background: #c0c0c0;
    position: absolute;
    left: -1px;
    width: 20%;
    height: 86%;
    line-height: 6;
    text-align: center;
    opacity: 0;
    transition: opacity .5s;

  }
  ::v-deep .icon-upload:hover {
    opacity: 1;
  }
</style>
