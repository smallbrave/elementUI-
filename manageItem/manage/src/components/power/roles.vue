<template>
<div class="container">
   <!-- --------------  面包屑导航 ------------- -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- --------------  内容展示区 ------------- -->
   <el-card>
      <el-row>
         <el-col>
            <el-button type="primary" @click="roleDialogVisible = true">添加角色</el-button>
         </el-col>   
      </el-row>
      <el-row>
         <el-col>   
         <el-table :data="rolelist" border stripe>
            <!-- 通过设置type="expand"添加一列带有 > 的格子（且具备扩展表格功能） -->
            <el-table-column type="expand" >
               <template v-slot="scope">
                  <el-row :class="['bdbottom',index1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                     <el-col :span="5" >
                        <el-tag closable @close="removeTagById(scope.row,item1.id)">{{item1.authName}} </el-tag>
                        <i class="el-icon-caret-right"></i>
                     </el-col>
                     <el-col :span="19">
                        <!-- 通过for循环嵌套渲染二级权限 -->
                        <el-row :class="[index2==0?'':'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                           <el-col :span="6">
                              <el-tag type="success" closable @close="removeTagById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                              <i class="el-icon-caret-right"></i>
                           </el-col>
                           <el-col :span="18">
                              <el-row class="vcenter">
                                    <el-tag type="warning" closable  @close="removeTagById(scope.row,item3.id)"
                                       v-for="item3 in item2.children" :key="item3.key">
                                       {{ item3.authName }}
                                    </el-tag>
                              </el-row>
                           </el-col>                           
                        </el-row>
                     </el-col>                     
                  </el-row>
               </template>
            </el-table-column>
            <!-- 索引列： 指定type="index" -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px" >
                  <template v-slot="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="editData(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeData(scope.row.id)">删除</el-button>
                  <el-button type="info" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button> 
               </template>
            </el-table-column>
         </el-table>
         </el-col>
      </el-row>   
   </el-card>
   <!-- ------------------------- 分配权限面板 ---------------------------  -->
   <el-dialog title="分配权限" :visible.sync="setRightDialogVisible"
   @close="setRightDialogClosed">
      <!-- ------- 树形控件 --------- -->
      <!-- :data指定数据源 :props树形控件的属性绑定对象，就是具体的展示内容 -->
      <!-- node-key 为这个树添加一个唯一值，方便之后操作-->
      <!-- default-checked-keys，某一项数据本身就有的数据 -->
      <el-tree ref="treeRef" :data="rightslist" :props="treeProps" 
      show-checkbox node-key="id" :default-checked-keys="defKeys"></el-tree>
      <span slot="footer">
         <el-button @click="setRightDialogVisible = false">取消</el-button>
         <el-button type="primary" @click="allotRights">确定</el-button>
      </span>
   </el-dialog>
   <!-- ---------------------------- 添加角色面板 ------------------------- -->
   <el-dialog title="添加角色" :visible.sync="roleDialogVisible"
   @close="handleClose">
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="roleForm">
         <el-form-item label="角色名称" prop="roleName"> 
            <el-input v-model="addRoleForm.roleName"></el-input>
         </el-form-item>
         <el-form-item label="角色描述"> 
            <el-input v-model="addRoleForm.roleDesc"></el-input>
         </el-form-item>      
      </el-form>
      <span slot="footer">
         <el-button @click="roleDialogVisible = false">取消</el-button>
         <el-button type="primary" @click="addRole">确定</el-button>
      </span>   
   </el-dialog>
   <!-- ---------------------------- 编辑角色面板 ------------------------- -->
   <el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" 
   @close="editHandleClosed">
      <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleForm">
         <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>   
         </el-form-item>
         <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.roleDesc"></el-input>   
         </el-form-item>  
      </el-form>
      <span slot="footer">
         <el-button @click="editRoleDialogVisible = false">取消</el-button>   
         <el-button @click="editRole" type="primary">确定</el-button>   
      </span> 
   </el-dialog>
</div>
</template>
<script>
export default {
    data() {
       return {
         //  角色数据
          rolelist: [],
          //控制权限控制面板的展示
          setRightDialogVisible: false,
          rightslist: [],
         //  树形控件的属性绑定对象
          treeProps: {
            //  指定子树为节点对象的某个属性值
             children: 'children',
            //指定节点标签为节点对象的某个属性值 
             label: 'authName'
          },
         //  已被选中的数据项，获取其id就行
          defKeys: [],
         //  当前即将被分配角色的数据项id
          roleId: '',
         //  控制添加角色的面板显示状态
          roleDialogVisible: false,
          addRoleForm: {
             roleName: '',
             roleDesc: ''
          },
          addRoleFormRules: {
             roleName: [
                {required: true,message:'角色名称为必填项',trigger: 'blur'}
             ]
          },
         //  控制编辑角色信息面板显示状态
          editRoleDialogVisible: false,
          editRoleForm: {
             roleName: '',
             roleDesc: ''
          },
          editId: '',
          editRoleFormRules: {
             roleName: [
                {required: true,message:'角色名称为必填项',trigger: 'blur'}
             ]
          }
       }
    },
    created() {
       this.getRolesList()
    },
    methods: {
      //  获取角色数据
       getRolesList() {
          this.$http.get('roles')
          .then((res)=>{
             if(res.data.meta.status == 200){
                this.rolelist = res.data.data;
             }else {
                this.$message.error("请求数据失败")
             }
          })
       },
       
       //根据id删除权限tag
       removeTagById(obj,id) {
          this.$confirm("确认删除？","提示",{
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
          }).then(()=>{
            this.$http.delete( `roles/${obj.id}/rights/${id}`)
            .then((res)=>{
               if(res.data.meta.status == 200){
                  this.$message({
                     type: 'success',
                     message: '操作成功'
                  });
                  obj.children = res.data.data
               }else {
                  this.$message.error("操作失败");      
               }
            }).catch(()=>{
               this.$message.error("操作失败");      
            })
          }).catch(()=>{
             this.$message.error("操作失败");
          })
       },

       //编辑按钮
       editData(obj) {
         this.editId = obj.id;
         this.editRoleForm.roleName = obj.roleName;
         this.editRoleForm.roleDesc = obj.roleDesc;
         this.editRoleDialogVisible = true;
       },
       removeData(id) {
         this.$confirm("确定删除？","提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(()=>{
            this.$http.delete(`roles/${id}`)
            .then((res)=>{
               if(res.data.meta.status != 200){
                 return  this.$message.error("删除失败") 
               }else {
                  this.getRolesList()
                  this.$message.success("删除成功")
               }
            }).catch(()=>{
               return  this.$message.error("删除失败") 
            })
         }).catch(()=>{
            this.$message.error("删除取消")
         }) 
       },
       //分配权限
       async showSetRightDialog(role) {
          this.roleId = role.id;
         let {data:res} = await this.$http.get('rights/tree')
         if(res.meta.status !== 200){
            this.$message.error("权限列表下载失败")
         }else {
            this.rightslist = res.data
            console.log(role.children)
            this.getLeafKeys(role,this.defKeys)
            this.setRightDialogVisible = true; 
         }
       },
      //  使用递归的方式，获取所有三级节点id;以此得到已选数据项
       getLeafKeys(node,arr) {
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach((item)=>{
             this.getLeafKeys(item,arr);
          })
       },

       //每次关闭权限数据框时，记得清空defKeys数组
       setRightDialogClosed() {
          this.defKeys = []
       },

       //分配权限的确认操作
      async allotRights() {
         const keys = [
            //  获取被全选的数据项
             ...this.$refs.treeRef.getCheckedKeys()
            //  获取半全选的数据项
            ,...this.$refs.treeRef.getHalfCheckedKeys()
         ]
         const idStr = keys.join(",");
         const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
         if(res.meta.status == 200){
            this.$message({
               type: 'success',
               message: res.meta.msg
            })
            this.getRolesList();
            this.setRightDialogVisible = false;
         }else {
            return this.$message.error("权限分配失败")
         }
       },

      //添加角色  
      addRole(){
         this.$refs.roleForm.validate(async (valid)=>{
            if(valid){
               let {data: res} = await this.$http.post('roles',this.addRoleForm);
               if(res.meta.status != 201){
                  return this.$message.error(res.meta.msg)
               }else {
                  this.$message.success("添加角色成功");
                  this.getRolesList();
                  this.roleDialogVisible = false;
               }
            }else{
               return 
            }
         })
      },
      // 添加角色面板关闭事件
      handleClose(){
         this.$refs.roleForm.resetFields();
      },
      // 编辑角色面板中的确认事件
      async editRole(){
         let {data: res} = await this.$http.put(`roles/${this.editId}`,
         this.editRoleForm)
         if(res.meta.status != 200) {
            return this.$message.error(res.meta.msg)
         }else {
            this.getRolesList();
            this.editRoleDialogVisible = false
            this.$message.success("修改数据成功")
         }
      },
      // 编辑角色面板关闭事件  
      editHandleClosed(){
         this.$refs.editRoleForm.resetFields();  
      }
   },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
}

.el-table {
   margin: 15px 0;
}
.el-tag {
   margin: 10px 10px 0 0;
}

.bdtop {
   border-top: 1px solid #ebeef5;
}

.bdbottom {
   border-bottom: 1px solid #ebeef5;
}

.vcenter {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
}
</style>