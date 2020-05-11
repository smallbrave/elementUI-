<template>
<div class="container">
   <!-- --------------  面包屑导航 ------------- -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>    
   <!-- -------------------------  卡片视图区 ------------------- -->
   <el-card>
       <el-row>
           <el-col>
               <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
           </el-col>
       </el-row>
       <!--  ----------------表格区域-------------- -->
       <!-- 引入的ui组件 -->
       <!-- :slection-type=> 选项框是否展示
            :expand-type=> 扩展符是否展示
            :show-index=>是否显示索引列;index-text用于设置索引列表头的字符
            border=>添加边框；show-row-hover：设置鼠标触及否高亮-->
       <tree-table class="tree-table" :data="catelist" :columns="columns" 
       :selection-type="false" :expand-type="false"
       show-index index-text="#" border>
        <!-- ‘是否可用列’  -->
        <!-- 自定义模板列，这里只能使用slot-scope不可v-slot  -->
           <template slot="isok" slot-scope="scope">
               <i class="el-icon-circle-check" style="color: lightgreen" v-if="scope.row.cat_deleted == false"></i>
               <i class="el-icon-circle-close" v-else style="color: red"></i> 
            </template>
        <!-- ‘排序列’  -->
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level == 0" type="primary">一级</el-tag>
                <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
                <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>                                
            </template> 
        <!-- ‘操作列’  -->
            <template slot="work" slot-scope="scope">
                <el-button type="primary" @click="editCate(scope.row)" size="medium" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" @click="deleteCate(scope.row)" size="medium" icon="el-icon-delete">删除</el-button>
            </template>
       </tree-table>
       <!--  ----------------分页-------------- -->
       <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 6, 10, 12]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
       </el-pagination>   
    </el-card>
    <!-- ---------------------------- 添加分类对话框 ---------------------- -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed">
        <el-form ref="addCateForm" :model="addCateList" :rules="addCateListRules">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateList.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <!-- 级联选项框 -->
                <!-- :options用来指定数据源 -->
                <!-- :props用来配置对象 -->                
                <!--:props="{ expandTrigger: 'hover' }"=>指定触发方式  -->
                <el-cascader
                ref="cateCascader"
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChange">
                </el-cascader>
            </el-form-item>            
        </el-form>
        <span slot="footer">
            <el-button @click="addCateDialogVisible = false">取消</el-button>            
            <el-button type="primary" @click="addCate">确定</el-button>
        </span>
    </el-dialog>

</div>
</template>
<script>
export default {
    data() {
        return {
            //查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            }, 
            // 商品分类的数据列表
            catelist: [],
            // 总数据条数
            total: 0,
            // 当前页码
            // 为tree-table的column进行初始设置
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
            },{
                label: '是否有效',
                //当前列的属性=>模板列
                type: 'template',
                //当前模板列使用的模板名称
                template: 'isok'
            },{
                label: '排序',
                type: 'template',
                template: 'order'
            },{
                label: '操作',
                type: 'template',
                template: 'work'
            }],
            // 控制添加分类面板的显示与隐藏
            addCateDialogVisible: false,

            // 输入的添加分类信息
            addCateList: {
                // 分类名称
                cat_name: '',
                // 父类名称
                cat_pid: 0,
                // 分类等级，默认为一级
                cat_level: 0
            },
            // 输入的添加分类信息的校验规则
            addCateListRules:{
                cat_name: [
                    {required: true, message: "分类名称必须填",trigger: 'blur'},
                ]
            },
            // 级联选择器的选择结果
            selectedKeys: [],  
            // 父级分类数据列表
            parentCateList: [], 
            // 级联数据框的配置对象
            cascaderProps: {
                // 指定选项的值为选项对象的某个属性值
                value: 'cat_id',
                label: 'cat_name',
                // 指定选项的子选项为选项对象的某个属性值
                children: 'children',
                // 触发方式
                expandTrigger: 'hover',
                checkStrictly: true
            },

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories',{params: this.queryInfo})
            if(res.meta.status != 200){
                return this.$message.error("查询数据失败")
            }else {
                this.catelist = res.data.result
                this.total = res.data.total
                this.$message({
                    type: 'success',
                    message: '数据获取成功'
                })
            }
        },
        editCate(obj){
            console.log(obj)
        },
        deleteCate(obj){
            console.log(obj)
        },
        
        //切换当且页面显示数据数目
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },

        //切换页码
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },

        // 添加分类 按钮事件
        showAddCateDialog(){
            this.getParentCateList()
            this.addCateDialogVisible = true;
        }, 
        //获取父级分类的数据列表
        async getParentCateList() {
            let {data: res} = await this.$http.get('categories',{ params: {type: 2}})
            if(res.meta.status != 200){
                return this.$message.error("父级信息获取失败")
            }else {
                this.parentCateList = res.data;
            }
        },
        // 级联选择框中，选择发生
        parentCateChange() {
            // 如果value的长度大于0时，才证明发送到后端的
            //提交数据需要更新（默认cat_pid=0;cat_level=0）
            if(this.selectedKeys.length > 0){
                this.addCateList.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
                this.addCateList.cat_level = this.selectedKeys.length;
                return 
            }else {
                this.addCateList.cat_pid = 0;
                this.addCateList.cat_level = 0;
            }
        },
        
        //对输入的添加分类进行确认提交
        addCate() {
            this.$refs.addCateForm.validate(async (valid)=>{
                if(valid){
                let {data: res} = await this.$http.post('categories',this.addCateList)
                console.log(res);
                if(res.meta.status != 201){
                    return this.$message.error("数据提交失败")
                }else {
                    this.$message({
                        type: 'success',
                        message: '添加数据成功'
                    })
                    this.getCateList();
                    this.addCateDialogVisible = false;
                }
                }
            }) 
        },

        //对添加分类面板的关闭进行处理
        addCateDialogClosed() {
            //重置级联选框中的值
            this.selectedKeys = [];
            this.addCateList.cat_pid = 0;
            this.addCateList.cat_level = 0;
            //重置表单中的值
            this.$refs.addCateForm.resetFields();

        }

    },
    watch: {
        // 级联选项框选中后自动收起：dropDownVisible
        selectedKeys(){
            this.$refs.cateCascader.dropDownVisible = false;
        }
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
}

.tree-table {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>