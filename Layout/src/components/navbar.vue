<template>
<el-container direction="vertical">
  <el-row>
<!-- 设置navbar，一个外层组件el-item用做一个包含各项的容器 
      可在其设置 子项的排布方向（水平/垂直=> mode）默认为垂直、
      整个navbar的背景颜色(background-color)、
      文字颜色(text-color)、
      选中时的颜色（active-text-color）、
      以及当前激活菜单的 index（:default-active）-->
      <el-menu
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="activeIndex">
<!-- 使用submenu用来创建二级菜单，但是el-submenu也只是一个容器 -->
      <el-submenu index="1">
          <!-- 注意此处： 需要为这个包含二级菜单的子项一个内容，此时就使用 
          <template slot="title">内容</template> -->
          <template slot="title">处理中心</template>
          <el-menu-item index="1-1">这是内容</el-menu-item>
      </el-submenu>
      <el-menu-item index="2">服务中心</el-menu-item>
      <el-menu-item index="3">加工中心</el-menu-item>
      <el-menu-item index="4">个人中心</el-menu-item>
      </el-menu>
  </el-row>
  <el-row>
<!-- 使用el-tabs实现tabs标签页；其中，el-tabs为整体的容器
      通过v-model绑定一个值，这个值是下面tab的name之一 -->
      <el-tabs
      v-model="activeName">
      <!-- el-tab-pane 是tabs中的一个小项，其中用label指定这个tab的标题，name指定标识这个tab -->
      <el-tab-pane label="用户管理" name="first">
      <!-- 这个里面就是这个tab中的内容 -->
          用户管理
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      </el-tabs>
<!-- 同时，可在el-tabs中设置type属性，以改变选项卡的标签风格
      type可取：card、border-card然后就是不指定，也就是默认的风格 -->
      <el-tabs
      type="card"
      v-model="activeName1">
      <el-tab-pane label="用户管理" name="first">
          用户管理
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      </el-tabs>
<!--可通过在el-tabs中设置tabPosition来决定tabs的位置
有： left、right、top、bottom  -->
      <!-- <el-tabs
      type="card"
      tabPosition="left"
      v-model="activeName2">
      <el-tab-pane label="用户管理" name="first">
          用户管理
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      </el-tabs> -->
<!-- 自定义标签，在tab-pane中，不设置任何属性，之后在标签内部，使用span标签，利用内部的slot属性，
实现tab自定义 -->
      <el-tabs
      type="card"
      v-model="activeName2">
      <el-tab-pane label="用户管理" name="first">
          <!-- 记住下面这个 -->
          <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
          我滴嘿嘿嘿
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      </el-tabs>
  </el-row>
  <el-row>
      //page页头
      <el-page-header  title="后退" 
      @back="back">
      <template slot="content">这是详情页面</template>
      </el-page-header>
  </el-row>
</el-container>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: "1",
            activeName: 'second',
            activeName1: 'first',
            activeName2: 'third'
        }
    },
    methods: {
        back(){
            console.log("back");
        }
    },
}
</script>
<style scoped>

</style>