<template>
  <el-container class="home_container">
            <!-- -------------------------------头部区域------------------------------------- -->
      <el-header>
            <div class="header_content">
                <img  src="../assets/logo.png" alt="图片未加载">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
          <!-- -------------------------------侧边栏------------------------------------- -->
          <el-aside :width="isCollapse?'64px':'200px'">
              <div class="toggle_button" @click="toggleCollapse">|||</div>
              <!-- unique-opened: 每次只能展开唯一的 -->
              <!-- :collapse： 折叠或者展开（boolean）
                   :collapse-transition: 是否开启折叠动画（boolean） -->
              <!-- router: 开启router模式，使用index的值作为导航  
                   为不含有下级目录的标签指定 :index="path"-->
              <!-- :default-active: 当前激活菜单的index(路由) -->
              <el-menu unique-opened :collapse="isCollapse" :router="true" :collapse-transition="false"
               background-color="#333744" text-color="#fff" active-text-color="#409EFF"
               :default-active="activePath">
                  <!-- 这里的:index来给每个item添加一个唯一值，让其被点击后只有其反应 -->
                  <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                      <template slot="title">
                          <i :class="[iconsObj[item.id] ,'iconfont']"></i>
                          <span>{{ item.authName }}</span>
                      </template>
                      <el-menu-item @click="savePath('/'+subitem.path + '')" v-for="subitem in item.children" :key="subitem.id" :index="'/'+subitem.path + ''">
                          <template slot="title">
                              <i class="el-icon-menu"></i>
                              <span>{{ subitem.authName }}</span>
                          </template>
                      </el-menu-item>
                  </el-submenu>
                </el-menu>
          </el-aside>
                    <!-- -------------------------------主要内容------------------------------------- -->
          <el-main>
              <router-view></router-view>
          </el-main>
      </el-container>
  </el-container>    
</template>
<script>
export default {
    data() {
        return {
            menulist: [],
            iconsObj: {
                '125': 'el-icon-s-custom',
                '103': 'el-icon-box',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-data-analysis' 
            },
            isCollapse: false,
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('path')
    },
    methods: {
        // 实现退出
        //清除sessionStorage、回到最初的login页面
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        // 获取侧栏的菜单项
        getMenuList(){
            this.$http.get('menus')
            .then((res)=>{
                if(res.data.meta.status == 200){
                    this.menulist = res.data.data
                }
            })
        },
        // 切换菜单的展示
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 存储当前所点击的侧栏地址
        savePath(path) {
            this.activePath = path;
            window.sessionStorage.setItem('path',path);
        }

    },
}
</script>
<style lang="less" scoped>
.home_container {
    height: 100%;
}

.el-header {
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 20px;
    color: #fff;
    background-color: #333744;
    > div {
        display: flex;
        align-items: center;
        img {
            width: 40px;
            height: 40px;
            background-color: #ccc;
            border-radius: 50%;
        }
        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    > .el-menu {
        border-right: none;
    }
}

.iconfont {
    margin-right: 10px;
}

.toggle_button {
    text-align: center;
    height: 30px;
    line-height: 30px;
    letter-spacing: .2em;
    cursor: pointer;
    color: #fff;
    background-color: #4A5064;

}

.el-footer {
    background-color: aqua;
}

</style>