<template>
<!-- 使用row和col来实现布局需要注意的是每次都务必然row中的col的span值之和为24 -->

<!-- Layout布局使用的是：通过 row 和 col 组件，并通过 col 组件的 span 属性我们就可以自由地组合布局。 -->
<!-- <el-row></el-row>代表一行，可用其将整个页面分为几个大块，可在其上指定 :gutter="整数"属性，表示列间距 -->
<!-- 可为<el-row></el-row>指定:type属性，值为flex，之后在其上直接使用justify属性，指定子元素的水平排版方式 -->
<!-- 可为<el-row></el-row>指定:type属性，值为flex，之后在其上直接使用align属性，指定子元素的垂直排版方式 -->
<!-- <el-col></el-col>代表一列，可使用:span="整数"指定列宽（一行下分为24份）;以:offset="整数"指定列偏移-->
<!-- 可在<el-col></el-col>上指定:push/:pull属性，值为整数，表示往右移和往左移格数 -->
  <div>
    <el-row class="nav">
      <el-col :offset="13" :span="11">
        <span>登录</span><span>注册</span>
        <el-divider direction="vertical"></el-divider>
        <span>帮助中心</span>
        <el-divider direction="vertical"></el-divider>
        <span><i class="el-icon-mobile-phone"></i>下载APP</span>
        <el-divider direction="vertical"></el-divider>
        <span>资质证照/协议规则<i class="el-icon-arrow-down"></i></span>
      </el-col>
    </el-row>
    <el-row class="banner">
      <el-col :offset="4" :span="20">
        <el-row class="banner-header">
          <el-col :span="4">
            小米有品
          </el-col>
          <el-col :offset="2" :span="4">
            <span>限时抢购</span><span>企业采购</span>
          </el-col>
          <el-col :offset="1" :span="4">
            <el-input class="input" prefix-icon="el-icon-search"></el-input>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row >
      <div class="content">
        content
      </div>
    </el-row>
    <el-row >
      <div class="footer">footer</div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<style scoped>
.nav {
  height: 40px;
  line-height: 40px;
  background-color: #ccc;
}

  .banner {
    background-color: aqua;
  }

  .content {
    height: 500px;
    background-color: bisque;
  }

  .footer {
    height: 90px;
    background-color: brown;
  }
</style>
