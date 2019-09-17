<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="shopAdd">添加分类</el-button>
      <zk-table
        :data="goodList"
        :columns="columns"
        :selection-type="false"
        show-index
        :expand-type="false"
      >
        <template slot="siok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
      </zk-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="adddialogVisible" width="40%" height="50%" @close="clearDialog">
      <el-form :model="addShops" :rules="addRules" ref="addRuleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addShops.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="goodList2"
            :props="cascaderProps"
            @change="cateChange" clearable change-on-select ref="claerCascder"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { cateGoodsList } from "../../api/index.js"
import { cateGoodsList2 } from "../../api/index.js"
import { addCate } from "../../api/index.js"

export default {
  data() {
    return {
      goodsInfo: {
        type: "",
        pagenum: 1,
        pagesize: 5
      },
      goodList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "siok"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      total: 0,
      adddialogVisible: false,
      addShops: {
        cat_name: "",
        cat_pid:0,
        cat_level:0
      },
      addRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      goodList2: [],
      selectedKeys: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await cateGoodsList(this.goodsInfo)
      this.total = res.data.total
      this.goodList = res.data.result
    },
    handleSizeChange(newsize) {
      this.goodsInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newnum) {
      this.goodsInfo.pagenum = newnum
      this.getGoodsList()
    },
    async getGoodsList2() {
      const { data: res } = await cateGoodsList2()
      this.goodList2 = res.data
    },
    shopAdd() {
      this.adddialogVisible = true
      this.getGoodsList2()
    },
    cateChange(){
      console.log(this.selectedKeys);
      
      if(this.selectedKeys.length >= 0){
        this.addShops.cat_pid=this.selectedKeys[this.selectedKeys.length - 1]
        this.addShops.cat_level= this.selectedKeys.length
      }else{
        this.addShops.cat_pid=0
         this.addShops.cat_level=0
      }
    },
   async cateAdd(){
    const {data:res}= await addCate(this.addShops)
    if(res.meta.status !== 201) return this.$message.error('添加分类失败')
    this.$message.success('添加分类成功!')
    this.getGoodsList()
    this.adddialogVisible = false
    },
    clearDialog(){
      this.addShops={}
      this.selectedKeys=[]
    }
  }
}
</script>
<style lang="less" scoped>
</style>

