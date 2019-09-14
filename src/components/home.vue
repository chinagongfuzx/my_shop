 <template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px':'200px'">
        <div class="toggle_button" @click="toggle">|||</div>
        <el-menu
          :default-active="defaultactive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409bff" router
          unique-opened :collapse="iscollapse" :collapse-transition="false"
        >
          <el-submenu :index="item.id+''" v-for="item in homeList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
            @click="activePath('/'+subItem.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
         
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
 <script>
 import {home_api} from '../api/index.js'
export default {
  data(){
    return{
      homeList:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      iscollapse:false,
      defaultactive:''
    }
  },
  created(){
    this.getMenuList()
    this.defaultactive=window.sessionStorage.getItem('activePathUrl')
  },
  methods: {
    quit() {
      window.sessionStorage.removeItem("token")
      this.$router.push("/login")
    },
   async getMenuList(){
      const {data:res} = await home_api()
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.homeList=res.data
      // console.log(this.homeList)
    },
    toggle(){
      this.iscollapse=! this.iscollapse
    },
    activePath(pathurl){
      window.sessionStorage.setItem('activePathUrl',pathurl)
      this.defaultactive=pathurl
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.el-menu{
  border-right: 0px;
}
.toggle_button{
  background-color: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  // 设置字符间距
  letter-spacing: 0.2rem;
}
</style>
 