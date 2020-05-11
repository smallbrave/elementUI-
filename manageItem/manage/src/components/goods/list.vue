<template>
<div class="container">
    <!-- --------------  面包屑导航 ------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ------------------ 卡片视图区域 ----------------- -->
   <el-card>
        <!-- --------- 输入搜索框 -------- -->
        <el-row :gutter="20">
            <el-col :span="8">
            <!-- 通过clearable实现输入内容可清空操作，之后有一个@clear事件 -->
                <el-input placeholder="请输入内容" v-model="queryInfo.query"
                clearable @clear="clearSearch"> 
                    <el-button slot="append" icon="el-icon-search"
                    @click="search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="goAddPage">添加商品</el-button> 
            </el-col>   
        </el-row>
        <!--  ------------------ 表格显示区域 ---------------- -->
        <el-table :data="goodslist" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量(KG)" width="70px"></el-table-column> 
            <el-table-column prop="upd_time" label="创建时间" width="140px">
                <template v-slot="scope">
                    {{scope.row.upd_time | dateFormat}}
                </template>
            </el-table-column> 
            <el-table-column  label="操作" width="130px">
                <template slot-scope="scope">
                    <el-button size="mini"
                    type="primary" icon="el-icon-edit"
                    @click="handleEdit(scope.row)"></el-button>
                    <el-button size="mini"
                    type="danger" icon="el-icon-delete"
                    @click="removeById(scope.row)"></el-button>
                </template>
            </el-table-column>                                  
        </el-table>
        <!-- -------------------- 页码区域 ------------------- -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 4, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>        
   </el-card>  
</div>
</template>
<script>
export default {
    data() {
        return {
            goodslist: [],
            //用于保存页码，每页显示内容以及输入参数
            queryInfo: {
                // 输入参数
                query: '',
                // 页码
                pagenum: 1,
                // 每页显示内容
                pagesize: 4,        
            },
            total: 0,
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },

        // 根据分页获取当前数据
        async getGoodsList(){
            let {data: res } = await this.$http.get('goods',{params: this.queryInfo})
            if(res.meta.status != 200){
                return this.$message.error("数据获取失败")
            }else {
                this.goodslist = res.data.goods,
                this.total = res.data.total;
            }
        },
        // 点击顶部搜索按钮
        search() {
            this.getGoodsList()
        },
        // 点击搜索框中的小叉
        clearSearch(){
            this.queryInfo.pagenum = 1;
            this.getGoodsList();
        },
        // 点击编辑按钮
        handleEdit(obj) {
            console.log(obj)
        },
        // 点击删除按钮        
        removeById(obj) {
            this.$confirm('确认删除？','提示',{
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$http.delete( `goods/${obj.goods_id}`)
                .then(({data:res})=>{
                    if(res.meta.status != 200){
                        return this.$message.error("删除失败")
                    }else {
                        this.$message.success("删除成功")
                        this.getGoodsList();
                    }
                })
            }).catch(()=>{
                this.$message.info("已取消删除操作")
            })
        },
        // 添加商品页面
        goAddPage(){
            this.$router.push('/goods/add')

        }
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

.el-table {
    margin: 15px 0;
    font-size: 12px;
}
</style>