<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
              :class="['bdbuttom',index === 0 ?'bdtop':'','vcenter']"
            >
              <el-col :span="8">
                <el-tag closable @close="deltelTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="16">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  :class="['vcenter','bdbuttom']"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="deltelTag(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-row v-for="item3 in item2.children" :key="item3.id">
                      <el-col>
                        <el-tag
                          type="warning"
                          closable
                          @close="deltelTag(scope.row,item3.id)"
                        >{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="提示" :visible.sync="showDialogVisible" width="30%" @close="colseDialog">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { rolesGet_api } from "../../api/index.js"
import { rolesDel_api } from "../../api/index.js"
import { rightsGetTree_api } from "../../api/index.js"
import { rolesGive_api } from "../../api/index.js"

export default {
  data() {
    return {
      rolesList: [],
      showDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      defKeys: [],
      rolesId: ""
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await rolesGet_api()
      this.rolesList = res.data
    },
    async deltelTag(roled, id) {
      const confimResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confimResult !== "confirm") {
        return this.$message.info("已取消删除")
      }
      const { data: res } = await rolesDel_api(roled.id, id)
      roled.children = res.data
    },
    async showDialog(roles) {
      this.rolesId = roles.id
      this.showDialogVisible = true
      const { data: res } = await rightsGetTree_api()
      this.rightsList = res.data
      // console.log(res.data)
      this.getKeysId(roles, this.defKeys)
    },
    getKeysId(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        return this.getKeysId(item, this.defKeys)
      })
    },
    async changeList() {
      var newarr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      var str = newarr.join(",")
      const { data: res } = await rolesGive_api(this.rolesId, str)
      if(res.meta.status !==200) return this.$message.error('更新权限失败')
      this.$message.success('更新权限成功!')
      this.getRolesList()
      this.showDialogVisible=false
    },
    colseDialog() {
      this.defKeys = []
    }
  }
}
</script>
<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbuttom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
