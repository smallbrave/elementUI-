<template>
<!-- container页面布局就是最常用的那种设置一个container，之后在其中使用一些html5语义化标签 -->
<!-- 记住： header/footer的height默认值为60px-->
<!-- 记住： aside的width默认值为300px -->
<!-- 记住： container中的direction属性指定其中元素的排列方向，默认为垂直排列，也可设置其为 horizontal -->
    <el-container direction="vertical">
        <el-header>header</el-header>
        <el-container>
            <!-- 使用一下button组件 -->
            <el-aside>
                <!-- button含有type属性：用于指定按钮的基本样式，是由primary、success、info、warning、danger -->
                <el-button type="primary">主要按钮</el-button>
                <el-button type="success">成功按钮</el-button>
                <el-button type="info">消息按钮</el-button>
                <el-button type="warning">警告按钮</el-button>
                <el-button type="danger">危险按钮</el-button>
                
            </el-aside>
            <el-main>
                <!-- 同时，还具有plain指定无背景颜色填充的button、round指定border-radius为圆角、
                circle指定为小圆圈 ，一般用于放小图标在其中icon属性-->
                <el-button type="primary" plain>无背景色</el-button>
                <el-button type="primary" plain round>无背景色且为圆角</el-button>
                <el-button type="success" plain circle icon="el-icon-check"></el-button>
            </el-main>
        </el-container>
        <el-footer>
            <!-- link文字链接： 使用<el-link></el-link> -->
            <!-- 含有属性： type指定显示的文字类型，同上面的button；动态绑定的:underline值为boolean值
            表示选中时是否由下划线,默认为有；disabled设置是否禁用；icon指定图标；herf指定链接 -->
            <el-link type="primary" icon="el-icon-edit">主要按钮</el-link>
            <el-link type="success">成功按钮</el-link>
            <el-link type="info">消息按钮</el-link>
            <el-link type="warning">警告按钮</el-link>
            <el-link type="danger">危险按钮</el-link>
            <el-link type="danger">危险按钮</el-link>
            <el-link type="danger" :underline="false" >危险按钮</el-link>
            <div>hhh</div>    
        </el-footer>
    </el-container>
</template>
<script>
export default {
    name: 'Container',

    
}
</script>
<style scoped>
.el-header,
.el-footer {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside,
.el-main {
    line-height: 200px;
    background-color: coral;
    text-align: center;
}

.el-aside {
    background-color: seashell;
}
</style>