<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>侧边栏管理</span>
        <el-button @click="AddMenu" type="parimar" size="small" class="btn-pub">添加侧边栏</el-button>

      </div>

      <el-table
    :data="menus"
    style="width: 100%;margin-bottom: 20px;"
    row-key="_id"
    border
    default-expand-all
    lazy
    :tree-props="{children: 'items', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="title"
      label="菜单名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="icon"
      label="图标"
      sortable
      width="180">
      <template v-slot="{ row }">
        <i :class="row.icon"></i>
        <span>{{ row.icon }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="createAt"
      label="日期">
      <template v-slot="{ row }">
        {{ $formatDate(row.createAt) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="indexPath"
      label="路由地址"
    >
    </el-table-column>
    <el-table-column
      label="操作"
    >
      <template v-slot="{ row }">
        <el-button @click="editMenu(row._id)" type="primary" size="mini">编辑</el-button>
        <el-button @click="delMenu(row._id)" type="danger" size="mini" >删除</el-button>
      </template>
  </el-table-column>
  </el-table>

    </el-card>

    <!-- 添加侧边栏 -->
    <el-drawer
  title="添加侧边栏"
  :visible.sync="drawer"
  :before-close="handleClose"
  direction="rtl"
  size="50%">
  <div>
    <el-form :model="MenuForm" :rules="MenuFormRules" ref="MenuFormRef" label-width="100px">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="MenuForm.title" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="MenuForm.icon" placeholder="请选择图标"></el-input>
          <el-button @click="innerDrawer = true">点击选择图标</el-button>
        </el-form-item>
        <el-form-item label="路由地址" prop="indexPath">
          <el-input v-model="MenuForm.indexPath" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="菜单项">
          <el-button v-if="!SecondaryMenu" @click="SecondaryMenu = true">创建二级菜单</el-button>
          <el-select v-if="SecondaryMenu" v-model="MenuForm.parentMenuId" placeholder="请选择父级菜单" size="small">
            <el-option v-for="Menu in menus" :key="Menu._id" :label="Menu.title" :value="Menu._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="drawer = false">取 消</el-button>
          <el-button type="primary" @click="AddMenuFn()">确 定</el-button>
      </el-form-item>
      </el-form>

   <el-drawer
     title="图标"
     :append-to-body="true"
     direction="rtl"
     :visible.sync="innerDrawer">
      <Icon></Icon>
   </el-drawer>
  </div>
</el-drawer>

  </div>
</template>

<script>
import { getMenuListAPI, delMenu, AddMenu, getByIdMenu, updateMenu } from '@/api'
import Icon from '@/views/category/Icon.vue'

export default {
  name: 'AsideSetting',
  components: {
    Icon
  },
  data () {
    return {
      menus: [],
      drawer: false,
      innerDrawer: false,
      MenuForm: {
        title: '',
        icon: '',
        indexPath: '',
        parentMenuId: ''
      },
      MenuFormRules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9-_]{1,55}$/, message: '图标非法', trigger: 'blur' }
        ],
        indexPath: [
          { required: true, message: '请输入路由地址', trigger: 'blur' },
          { min: 5, max: 20, message: '路由超出限制', trigger: 'blur' }
        ]
      },
      // 二级菜单判断
      SecondaryMenu: false,
      isEdit: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      const { data: res } = await getMenuListAPI()
      if (res.status !== 200) return this.$message.error('侧边栏获取失败')
      this.menus = res.data
    },
    // 删除侧边栏
    async delMenu (id) {
      const confirmResult = await this.$confirm('此操作将导致管理员数据丢失, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await delMenu(id)
        if (res.status !== 200) return this.$notify.error(res.message)
        this.getMenuList()
        this.$notify.success('删除成功')
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.MenuFormRef.resetFields()
          this.MenuForm = {
            title: '',
            icon: '',
            indexPath: '',
            parentMenuId: ''
          }
          this.SecondaryMenu = false
          done()
        })
        .catch(_ => {})
    },
    // 添加侧边栏按钮
    AddMenu () {
      this.drawer = true
      this.isEdit = false
    },
    // 添加/修改侧边栏
    async AddMenuFn () {
      this.$refs.MenuFormRef.validate(async valid => {
        if (!valid) return this.$notify.error('校验未通过')
        if (!this.isEdit) {
          const { data: res } = await AddMenu(this.MenuForm)
          if (res.status !== 201) return this.$notify.error(res.message)
          this.$notify.success(res.message)
          this.getMenuList()
        } else {
          const { data: res } = await updateMenu(this.MenuForm)
          if (res.status !== 200) return this.$notify.error(res.message)
          this.$notify.success(res.message)
          this.drawer = false
          this.$refs.MenuFormRef.resetFields()
          this.MenuForm = {
            title: '',
            icon: '',
            indexPath: '',
            parentMenuId: ''
          }
          this.getMenuList()
        }
      })
    },
    // 编辑侧边栏
    async editMenu (id) {
      const { data: res } = await getByIdMenu(id)
      if (res.status !== 200) return this.$notify.error(res.message)
      this.MenuForm = res.data
      this.drawer = true
      this.isEdit = true
      if (this.MenuForm.parentMenuId !== '') {
        this.SecondaryMenu = true
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
