<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt>
      </div>

      <el-form ref="form" label-width="65px" class="login_form" :model="loginForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            type="password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {login_api} from '../api/index.js'
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs.form.validate(async flag => {
        if (!flag) return
        const { data } = await login_api(this.loginForm)
        // console.log(data);
        // console.log(data.data.token);
        if (data.meta.status === 200) {
          window.sessionStorage.setItem('token', data.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('您输入的信息有误!')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  position: absolute;
  border-radius: 3px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box {
  height: 130px;
  width: 130px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 0 10px 0 #ddd;
  border-radius: 50%;
}
.avatar_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.login_form {
  //盒子模型
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
}
.btns {
  // flex 布局
  display: flex;
  justify-content: flex-end;
}
</style>
