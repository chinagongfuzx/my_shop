<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="只允许为第三级分类设置参数" type="warning" :closable="false" class="el-icon-warning"></el-alert>
      <p>
        选择商品分类:
        <el-cascader
          v-model="selectedKeys"
          :options="GoodList"
          :props="CateProps"
          @change="handleChange"
        ></el-cascader>
      </p>
      <el-tabs v-model="sel" @tab-click="tabsChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="flag" @click="adddialogVisible = true">添加参数</el-button>
          <el-table :data="manyData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数列表"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editParams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="delParamsList(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="flag" @click="adddialogVisible = true">添加属性</el-button>
          <el-table :data="onlyData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editParams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="delParamsList(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addListClear"
    >
      <el-form :model="addListData" :rules="addListRules" ref="addRuleForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addListData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adddList">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editListClear"
    >
      <el-form :model="editListData" :rules="addListRules" ref="editRuleForm" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editListData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  cateGoodsList,
  getCateParameter,
  addParamsList,
  editParamsById,
  editParamsList,
  delParamsList
} from "@/api"
import { async } from "q"
export default {
  data() {
    return {
      GoodList: [],
      selectedKeys: [],
      CateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      flag: true,
      sel: "many",
      goodsId: 0,
      manyData: [],
      onlyData: [],
      adddialogVisible: false,
      addListData: {
        attr_name: ""
      },
      addListRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      editListData: {
        attr_name: "",
        attr_id: 0
      },
      editdialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  computed: {
    titleText() {
      if (this.sel === "many") {
        return "动态参数"
      } else {
        return "静态属性"
      }
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await cateGoodsList()
      this.GoodList = res.data
    },
    async handleChange() {
      this.getParamsData()
    },
    tabsChange() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyData = []
        this.onlyData = []
        return
      } else {
        this.flag = false
        this.goodsId = this.selectedKeys[2]
        const { data: res } = await getCateParameter(this.goodsId, this.sel)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
          item.inputVisible = false
          item.inputValue = ""
        })
        if (this.sel === "many") {
          this.manyData = res.data
          //   console.log(this.manyData)
        } else {
          this.onlyData = res.data
          //   console.log(this.onlyData)
        }
      }
    },
    addListClear() {
      this.$refs.addRuleForm.resetFields()
    },
    adddList() {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return this.$message.error("添加" + this.titleText + "失败")
        const { data: res } = await addParamsList(
          this.goodsId,
          this.addListData.attr_name,
          this.sel
        )
        this.adddialogVisible = false
        this.getParamsData()
        this.$message.success("添加" + this.titleText + "成功")
      })
    },
    editdList() {
      this.$refs.editRuleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await editParamsList(
          this.goodsId,
          this.editListData.attr_id,
          this.editListData.attr_name,
          this.sel
        )
        // console.log(res);
        this.editdialogVisible = false
        this.getParamsData()
        this.$message.success("编辑" + this.titleText + "成功")
      })
    },
    editListClear() {
      this.$refs.editRuleForm.resetFields()
    },
    async editParams(id) {
      // console.log(id)
      this.editdialogVisible = true
      const { data: res } = await editParamsById(this.goodsId, id, this.sel)
      this.editListData.attr_name = res.data.attr_name
      this.editListData.attr_id = res.data.attr_id
    },
    async delParamsList(id) {
      const config = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (config !== "confirm") {
        return this.$message.info("取消删除成功!")
      }
      const { data: res } = await delParamsList(this.goodsId, id)
      if (res.meta.status !== 200) return this.$message.error("删除失败")
      this.$message.success("删除成功")
      this.getParamsData()
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ""
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ""
      row.inputVisible = false
      this.getAttrvals(row)
    },
    async getAttrvals(row) {
      const { data: res } = await editParamsList(
        this.goodsId,
        row.attr_id,
        row.attr_name,
        this.sel,
        row.attr_vals.join(" ")
      )
      if (res.meta.status !== 200) return this.$message.error("修改参数项失败!")
      this.$message.success("修改参数项成功!")
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.getAttrvals(row)
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 150px;
}
</style>