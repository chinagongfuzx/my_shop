<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="userAdd">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userstatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="userEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="userdel(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="rolePut(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addclear">
      <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="addForm.mobile" type="tel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editclear">
      <el-form :model="editList" :rules="usereditRule" ref="usereditRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editList.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editList.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="roleDialogVisible" width="30%">
      <p>当前的用户:{{uname}}</p>
      <p>当前的角色:{{rolename}}</p>
      <p>
        分配新角色
        <el-select v-model="roleById" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { userList_api } from "../../api/index.js"
import { userInfo_api } from "../../api/index.js"
import { useradd_api } from "../../api/index.js"
import { userEdit_api } from "../../api/index.js"
import { userEditAdd_api } from "../../api/index.js"
import { userDel_api } from "../../api/index.js"
import { rolesGet_api } from "../../api/index.js"
import { rolesUserEdit_api } from "../../api/index.js"

export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (myreg.test(value)) return callback()
      callback(new Error("邮箱格式不正确!"))
    }
    var checkTel = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (reg.test(value)) return callback()
      callback(new Error("电话号码不正确!"))
    }
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkTel, trigger: "blur" }
        ]
      },
      editList: {},
      usereditRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkTel, trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      roleDialogVisible: false,
      uname: "",
      rolename: "",
      roleList: [],
      roleById: "",
      userId: ""
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await userList_api(this.queryInfo)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
      // console.log(newsize);
    },
    handleCurrentChange(newval) {
      // console.log(newval);
      this.queryInfo.pagenum = newval
      this.getUserList()
    },
    async userstatus(userinfo) {
      console.log(userinfo.id)
      const { data: res } = await userInfo_api(userinfo.id, userinfo.mg_state)
      // console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error("更新用户状态失败")
      }
      this.$message.success("更新用户状态成功")
    },
    userAdd() {
      this.addDialogVisible = true
    },
    addclear() {
      this.$refs.addFormRef.resetFields()
    },
    adduser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await useradd_api(this.addForm)
        if (res.meta.status !== 200) {
          this.$message.error("添加用户失败!")
        }
        this.$message.success("添加用户成功")
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    async userEdit(user) {
      const { data: res } = await userEdit_api(user.id)
      this.editList = res.data
      this.editDialogVisible = true
    },
    edituser() {
      this.$refs.usereditRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await userEditAdd_api(
          this.editList.id,
          this.editList
        )
        if (res.meta.status !== 200) {
          this.$message.error("编辑用户失败!")
        }
        this.$message.success("编辑用户成功")
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    editclear() {
      this.$refs.usereditRef.resetFields()
    },
    async userdel(id) {
      const configRemove = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      // console.log(configRemove)
      if (configRemove !== "confirm") {
        return this.$message.info("已取消删除")
      }
      const { data: res } = await userDel_api(id)
      this.getUserList()
    },
    async rolePut(roled) {
      this.roleDialogVisible = true
      this.uname = roled.username
      this.rolename = roled.role_name
      this.userId = roled.id
      const { data: res } = await rolesGet_api()
      this.roleList = res.data
    },
    async roleEdit() {
      const { data: res } = await rolesUserEdit_api(this.userId, this.roleById)
      if (res.meta.status !== 200) return this.$message.error("更新角色失败")
      this.$message.success("更新角色成功")
      this.getUserList()
      this.roleDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>

