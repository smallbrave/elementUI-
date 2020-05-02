<template>
<div class="container">
   <!-- --------------  面包屑导航 ------------- -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- --------------  表格显示 ------------- -->
   <el-table :data="rightslist" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName"
         label="权限名称" >
      </el-table-column>
      <el-table-column prop="path"
         label="路径" >
      </el-table-column>
      <el-table-column prop="level"
         label="权限等级" >
         <!-- 使用v-slot在插槽中拿到组件中的内容 -->
         <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag> 
            <el-tag v-if="scope.row.level > 1" type="warning">三级</el-tag>                 
         </template>
      </el-table-column>    
   </el-table>   
</div>
    
</template>
<script>
export default {
    data() {
       return {
          rightslist: []
       }
    },
    created() {
       this.getRightsList()
    },
    methods: {
       getRightsList() {
          this.$http.get('rights/'+ 'list')
          .then((res)=>{
             if(res.data.meta.status == 200){
                this.rightslist = res.data.data
             }else {
                this.$message.error("数据请求失败")
             }
          })
       }
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
}

</style>