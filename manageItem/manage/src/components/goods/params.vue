<template>
<div class="container">
   <!-- --------------  面包屑导航 ------------- -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>  
   <!-- ----------------- 卡片区域 ------------------ -->
   <el-card>
       <el-alert type="warning" title="注意：只允许为第三级分类设置相关参数" 
        show-icon :closable="false"></el-alert>
        <!-- ----------- 商品分类区 ---------- -->
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类：</span>
                <!-- ----------------选择商品分类的级联选择框--------------------- -->
                <el-cascader
                ref="paramsCascader"
                v-model="selectedKeys"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange">
                </el-cascader>
            </el-col>
        </el-row>
        <!-- ---------------tab页签区域--------------- -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- ---------动态参数面板--------- -->
            <!-- name属性可以指定为一个标识符 -->
            <el-tab-pane label="动态属性" name="many">
                <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="dialogVisible = true">添加参数</el-button>
                <el-table :data="manyTableData" border stripe>
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item+''+index"
                            closable  @close="handleClose(index,scope.row)">{{ item }}</el-tag>
                            <!-- @close="handleClose(item)" -->
                            <!-- -------------实现button和input的显示切换 -->
                            <!-- 输入文本框 -->
                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <!-- 按钮， -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>                            
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="showEditDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeParams(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- ---------静态属性面板--------- -->
            <el-tab-pane label="静态属性" name="only">
                <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="dialogVisible = true">添加属性</el-button>
                <el-table :data="onlyTableData" border stripe>
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item+''+index"
                            closable  @close="handleClose(index,scope.row)">{{ item }}</el-tag>
                            <!-- @close="handleClose(item)" -->
                            <!-- -------------实现button和input的显示切换 -->
                            <!-- 输入文本框 -->
                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <!-- 按钮， -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>                            
                        </template>                    
                    </el-table-column>                    
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" 
                            @click="showEditDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeParams(scope.row)">删除</el-button>
                        </template>                        
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
   </el-card>
   <!-- ----------------------- 添加属性面板 -------------------- -->
   <el-dialog :visible.sync="dialogVisible" :title="'添加' + titleText" >
       <el-form ref="paramsForm" :model="paramsFormData" :rules="paramsFormDataRules">
           <el-form-item  :label="titleText" prop="attr_name">
                <el-input v-model="paramsFormData.attr_name" ></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
       </span>
   </el-dialog>
   <!-- ----------------------- 点击编辑按钮属性面板 -------------------- -->
   <el-dialog :visible.sync="editDialogVisible" :title="'修改' + titleText" >
       <el-form ref="editForm" :model="editFormData" :rules="editFormDataRules">
           <el-form-item  :label="titleText" prop="attr_name">
                <el-input v-model="editFormData.attr_name" ></el-input>
           </el-form-item>
       </el-form>
       <span slot="footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addEdit">确 定</el-button>
       </span>
   </el-dialog>      
</div>
    
</template>
<script>
export default {
    data() {
        return {
            // 级联选择框选中的值的id
            selectedKeys: [],
            // 所有的商品列表
            cateList: [],
            // 级联选择框的一些设置项
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 被激活的页签名称
            activeName: 'many',
            // 动态参数tab下面的table数据源
            manyTableData: [],
            // 静态参数tab下的table数据源
            onlyTableData: [],
            // 控制添加属性面板的显示
            dialogVisible: false,
            paramsFormData: {
                attr_name: ''
            },
            paramsFormDataRules: {
                attr_name: [
                    {required: true, message: '内容必填',trigger: 'blur'}
                ]
            },
            //点击编辑按钮后，控制其面框的显示与隐藏
            editDialogVisible: false,
            editFormData: {
                attr_name: ''
            },
            editFormDataRules: {
                attr_name: [
                    {required: true,message: '内容必填',trigger: 'blur'}
                ]
            },
            // 实现input和button的切换的状态管理
            // inputVisible: false,
            // 文本框输入内容
            // inputValue: '',
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有商品分类列表
        async getCateList() {
            let { data : res} = await this.$http.get('categories')
            if(res.meta.status != 200){
                this.$message.error("获取数据失败")
            }else {
                this.cateList = res.data
            }
        },
        // 级联选择器选中内容切换事件
        // 当内容改变时=> 发起关于 "静态属性"、"动态参数的获取"
        handleChange(val) {
            if(val.length != 3 ){
                this.selectedKeys = [];
                this.manyTableData = [];
                this.onlyTableData = [];
                return;
            }
            this.getParamsData()
            
        },
        // tab页签点击事件处理
        handleTabClick() {
            this.getParamsData()
        },

        //获取参数所有数据
        // 根据所选级联选择器三级id以及对应的tab
        async getParamsData() {
            let { data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
            {params: {sel: this.activeName}});
            if(res.meta.status != 200){
                return 
            }else {

                //将以空格分隔的字符串 => 数组 
                res.data.forEach((item)=>{
                    item.attr_vals = item.attr_vals?item.attr_vals.split(" "):[];
                //在item中添加inputVisible以及inputValue实现为每行
                //元素添加inputVisible以及inputValue
                    item.inputVisible = false;
                    item.inputValue = '';
                })
                if(this.activeName == 'many'){
                    this.manyTableData = res.data;
                }else {
                    this.onlyTableData = res.data
                }
            }
        },

        //添加属性的确认操作
        addParams() {
            this.$refs.paramsForm.validate(async (valid)=>{
                if(valid){
                   let {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                       attr_name: this.paramsFormData.attr_name,
                       attr_sel: this.activeName
                   })
                   if(res.meta.status == 201) {
                       this.$message({
                           type: 'success',
                           message: '添加成功'
                       })
                   }else {
                       this.$message.error("添加失败");
                   }
                }
                this.getParamsData();
                this.dialogVisible = false;
                this.$refs.paramsForm.resetFields();
                return
            })
        },

        //点击修改按钮 
        async showEditDialog(obj) {
            this.editDialogVisible = true;
            let { data: res } = await this.$http.get( `categories/${this.cateId}/attributes/${obj.attr_id}`,{
                params:{
                    attr_sel: this.activeName
                }
            })
            if(res.meta.status != 200){
                return this.$message.error("数据获取失败")
            }else {
                this.editFormData = res.data;
            }
        },
        // 点击编辑内容中的确认按钮
        addEdit(){
            this.$refs.editForm.validate(async (valid)=>{
                if(valid){
                    let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/
                    ${this.editFormData.attr_id}`,{
                        attr_sel: this.activeName,
                        attr_name: this.editFormData.attr_name
                    });
                    if(res.meta.status != 200){
                       return this.$message.error(res.meta.msg)
                    }else {
                       this.$message.success("更新成功");
                       this.getParamsData();
                       this.editDialogVisible = false; 
                    }
                }
            })
        },
        // 点击删除按钮
        async removeParams(obj){
            let confirmResult = await this.$confirm("是否确认删除？","提示",{
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: 'warning'
            })
            if(confirmResult != 'confirm'){
                return this.$message.info("已取消删除")
            }else {
                let {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${obj.attr_id}`);
                if(res.meta.status != 200){
                    return this.$message.error("删除失败");
                }else {
                    this.$message.success("删除成功");
                    this.getParamsData();
                }
            }
        },

        //当new tag中有了数据输入且按下了enter或者失去焦点处理函数
        async handleInputConfirm(obj){
            // 当输入内容为空/权威空格=>清除内容，关闭input
            if(obj.inputValue.trim().length == 0){
                obj.inputValue = "";
                obj.inputVisible = false;
                return 
            }
            obj.attr_vals.push(obj.inputValue);
            obj.inputValue = "";
            obj.inputVisible = false;
            // 新添加的数据，需要同步到后端数据库
            let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${obj.attr_id}`,{
                attr_name: obj.attr_name,
                attr_sel: obj.attr_sel,
                attr_vals: obj.attr_vals.join(" ")
            })
            if(res.meta.status != 200) {
                return this.$message.error("添加失败")
            }else {
                this.$message.success("添加成功")
            }
        },
        // 点击new tag
        showInput(obj){
            // 点击后，让input显示
            obj.inputVisible = true;
            // 让input自动获取焦点
            // $nextTick,在页面被重新渲染后，再执行
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 点击tag的小叉x，实现删除操作
        async handleClose(index,obj) {
            //通过index索引,在数组中将数据删除
            obj.attr_vals.splice(index,1);
            let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${obj.attr_id}`,{
                attr_name: obj.attr_name,
                attr_sel: obj.attr_sel,
                attr_vals: obj.attr_vals.join(" ")
            })
            if(res.meta.status != 200){
                return this.$message.error("删除失败")
            }else {
                this.$message.success("删除成功")
            }
        }
    },
    computed: {
        // tab内容中的按钮的可用状态管理
        isBtnDisabled(){
            if(this.selectedKeys.length > 0){
                return false;
            }
            return true;
        },
        
        //获取选中的三级ID
        cateId() {
            if(this.selectedKeys.length > 0) {
                return this.selectedKeys[this.selectedKeys.length-1]
            }else {
                return null
            }
        },

        //确认点击添加动态参数/静态属性后，显示的面板的标题 
        titleText(){
            if(this.activeName == "many")
            return "动态参数";
            return "静态属性"
        }
    },

    //级联菜单，选中后自动收起
    watch: {
        selectedKeys() {
            this.$refs.paramsCascader.dropDownVisible = false
        }
    },
    
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
}

.cat_opt {
    margin: 15px 0;
}

.el-table {
    margin-top: 15px;
}

.el-tag {
    margin: 0 10px;
}

.input-new-tag {
    width: 100px;
}
</style>