<template>
<div class="container">
   <!-- -------------------------------面包屑导航区---------------------- -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- -------------------------------卡片视图区---------------------- -->
   <el-card class="box-card">

      <!-- --------- 输入搜索框 -------- -->
      <el-row :gutter="20">
         <el-col :span="8">
            <!-- 通过clearable实现输入内容可清空操作，之后有一个@clear事件 -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
               <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
            </el-input>
         </el-col>
         <el-col :span="4">
            <el-button type="primary" @click="addUser">添加用户</el-button> 
         </el-col>   
      </el-row>

      <!-- --------- 用户列表区 -------- -->
      <el-row>
         <!-- 通过:data为这个表格指定数据，border添加边框，stripe指定斑马纹 -->
         <el-table :data="userlist" border stripe>
            <!-- 通过指定type=“index”实现一个索引列，使用label指定一个字符，用于填充索引列中头行的内容填充 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
               <!-- 通过slot-scope设置scope(随意一个名字都行)，之后通过scope.row拿到这一行的内容
               作用域插槽 -->
               <template v-slot="scope">
                  <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
               </template>
            </el-table-column>
            <el-table-column label="操作" width="240px">
               <template v-slot="scope">
                  <!-- 修改按钮 -->
                  <el-button type="primary" size="mini" icon="el-icon-edit" 
                  @click="showEditDialog(scope.row.id)"></el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" size="mini" icon="el-icon-delete"
                  @click="removeUserById(scope.row.id)"></el-button>
                  <!-- 分配角色按钮 -->
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                     <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                  </el-tooltip>
               </template>
            </el-table-column>
         </el-table>
      </el-row>

      <!-- -----------页码----------- -->
      <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pagenum"
         :page-sizes="[1, 2, 5, 10]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
      </el-pagination>
   </el-card>

      <!-- --------- 添加用户面板 -------- -->
   <el-dialog
      title="用户添加"
      :visible.sync="isShow"
      :before-close="handleClose"
      @close="dialogClose">
      <!-- 内容主体 -->
      <!-- 使用el-form=> :model指定绑定的数据; :rules绑定验证规则
      在子类中，通过v-model绑定数据，prop绑定规则 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormList" >
         <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
         </el-form-item>         
         <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
         </el-form-item>
         <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
         </el-form-item>         
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
         <el-button @click="isShow = false">取 消</el-button>
         <el-button type="primary" @click="addUserConfirm" >确 定</el-button>
      </span>
   </el-dialog>
      <!-- --------- 修改用户面板 -------- -->
   <!-- 通过:visible.sync设置boolean值，决定dialog面板的显示与隐藏 -->
   <el-dialog
      title="用户信息修改"
      :visible.sync="editDialog"
      @close="closeEditDialog">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
         <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
         </el-form-item>
         <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
         </el-form-item>         
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="editDialog = false">取 消</el-button>
         <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
   </el-dialog>
</div>
    
</template>
<script>
export default {
   data() {
      //             自定义校验规则
      let checkEmail = (rule,value,callback)=>{
         var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
         if(reg.test(value)){
            return callback()
         }
         callback(new Error("请输入合法的邮箱地址"))
      };
      let checkMobile = (rule,value,callback)=>{
         var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
         if(reg.test(value)){
            return callback()
         }
         callback(new Error("请输入合法的电话号码"))
      };
      return {
         // 获取用户列表所需的参数
         queryInfo: {
            query: '',
            pagenum: 1,
            // 当前每页显示多少数据
            pagesize: 2
         },
         userlist: [],
         total: 0,
         query: '',
         isShow: false,

         //添加用户的数据双向绑定
         addForm: {
            username: '',
            password: '',
            email: '',
            mobile: ''
         },
         //添加用户的检验规则
         addFormRules: {
            username: [
               {required: true,message: "账户名不能为空", trigger: "blur"},
               {min: 3,max: 10,message: "长度在3-10之间",trigger: "blur"}
            ],
            password: [
               {required: true,message: "密码不能为空", trigger: "blur"},
               {min: 6,max: 10,message: "长度在6-10之间",trigger: "blur"}               
            ],
            // 自定义校验规则
            email: [
               {required: true,message: "邮箱不能为空", trigger: "blur"},               
               {validator: checkEmail, trigger: 'blur' }
            ],
            mobile: [
               {required: true,message: "手机号码不能为空", trigger: "blur"},               
               {validator: checkMobile, trigger: 'blur' }
            ]

         },

         //修改用户信息的面板控制 
         editDialog: false,
         //添加用户的数据双向绑定
         editForm: {},
         //添加用户的检验规则
         editFormRules:{
            email:[
               {required: true, message: '邮箱必填',trigger: 'blur'},
               {validator: checkEmail,trigger: 'blur'}
            ],
            mobile:[
               {required: true, message: '电话必填',trigger: 'blur'},
               {validator: checkMobile,trigger: 'blur'}
            ]            
         } 

      }
   },
   created() {
      this.getUserList()
   },
   methods: {
      //获取用户列表
      getUserList() {
         this.$http.get('users',{params: this.queryInfo})
         .then((res)=>{
            if(res.data.meta.status == 200){
               this.userlist = res.data.data.users;
               this.total = res.data.data.total
            }else {
               return this.$message({
                  type: 'error',
                  message: '获取用户列表失败'
               })
            }
         })
      },

      //                                    页码中的事件
      // pageSize 改变时会触发
      handleSizeChange(newSize) {
         this.queryInfo.pagesize = newSize;
         //page-size被改变，需要重新发送请求
         this.getUserList()
      },
      // currentPage 改变时会触发
      handleCurrentChange(newPage) {
         //点击了一个页码，需要重新发送请求
         this.queryInfo.pagenum = newPage;
         this.getUserList();
      },

      //                                    switch中的事件
      //监听switch的状态
      userStateChange(obj) {
         //状态改变了也需要同步数据库中该数据的状态
         this.$http.put(`users/${obj.id}/state/${obj.mg_state}`)
         .then((res)=>{
            if(res.data.meta.status != 200){
               this.$message({
                  type: 'error',
                  message: "更新失败"
               })
               obj.mg_state = !obj.mg_state;
            }else {
               this.$message({
                  type: 'success',
                  message: "更新成功"
               })
            }
         })
      },

      //                                     dialog中的事件
      // 点击对话框小叉（x）的事件
      handleClose() {
         this.isShow = false;
      },

      //添加用户按钮
      addUser() {
         this.isShow = true;
      },
      
      //确认添加
      addUserConfirm(){
         this.$refs.addFormList.validate((valid)=>{
            if(valid) {
               this.$http.post('users',this.addForm)
               .then((res)=>{
                  console.log(res.data)
                  if(res.data.meta.status == 201){
                     this.isShow = false;
                     this.getUserList();
                     this.$message({
                        type: 'success',
                        message: '添加成功'
                     })
                  }else {
                     this.$message({
                        type: 'error',
                        message: res.data.meta.msg
                     })
                  }
               })
            }else{
               return 
            }
         })

      },

      //添加用户dialog面板关闭
      dialogClose() {
         // el-form组件提供一个清空的方法： resetFields（）
         this.$refs.addFormList.resetFields();
      },

      // -----------------------------       修改用户数据
      //通过修改按钮传递的scope.row.id获取当前用户信息
      showEditDialog(id) {
         this.$http.get('users/'+id)
         .then((res)=>{
            if(res.data.meta.status == 200){
               this.editForm = res.data.data;
            }else {
               return this.$message.error("查询数据失败")
            }
         })
         this.editDialog = true
      },
      //修改用户信息后进行确认
      editUser() {
         this.$refs.editForm.validate((valid)=>{
            if(valid){
               this.$http.put('users/'+ this.editForm.id,{
                  email: this.editForm.email,
                  mobile: this.editForm.mobile
               }).then((res)=>{
                  if(res.data.meta.status == 200){
                     this.$message({
                        type: 'success',
                        message: '修改成功'
                     })
                  }else {
                     this.$message.error("修改失败")
                  }
               })
               //数据处理完毕后需要再次获取数据
               this.editDialog = false;
               this.getUserList();
            }else {
               return 
            }
         })
      },
      //关闭修改用户信息框
      closeEditDialog() {
         //重置表单内容
         this.$refs.editForm.resetFields()
      },

      //-------------------------------      删除用户数据
      removeUserById(id){
         console.log(id)
         //创建一个弹框，提示用户是否删除
         // 使用$confirm时，点击'确认'时=>返回字符串 confire
         //点击 '取消'时=>报错；所以在then中获取点击确认，catch中获取点击取消
         this.$confirm('确认删除？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(()=>{
            this.$http.delete('users/'+id)
            .then((res)=>{
               if(res.data.meta.status == 200){
                  this.$message({
                     type: 'success',
                     message: '删除成功'
                  })
                  //删除操作后，记得再次获取用户列表
                  this.getUserList()
               }else {
                  this.$message({
                     type: 'error',
                     message: '删除失败'
                  })
               }
            })
         }).catch(()=>{
            this.$message({
               type: 'info',
               message: '已取消删除'
            })
         })
      }

   },
    
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
   margin-bottom: 15px;
   font-size: 12px;
}

.el-card {
   box-shadow: 0 1px 1px rgba(0,0,0,0.15)!important ;
}

.el-row {
   margin-bottom: 15px;
}
</style>