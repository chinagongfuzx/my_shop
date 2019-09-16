<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="300"></el-table-column>
        <el-table-column prop="path" label="路径" width="300"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level ==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { rightsGet_api } from "../../api/index.js"
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await rightsGet_api()
      console.log(res)

      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
