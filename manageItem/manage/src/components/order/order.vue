<template>
<div class="container">
   <!-- --------------  面包屑导航 ------------- -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>

   <el-card>
      <el-row>
         <el-col :span="8">
            <el-input placeholder="请输入内容" >
               <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>         
         </el-col>
      </el-row>
      <!-- -----------------------------表格显示区域------------------------------- -->
      <el-table :data="orderlist" border stripe>
         <el-table-column type="index" label="#"></el-table-column>
         <el-table-column prop="order_number" label="订单编号"></el-table-column>
         <el-table-column prop="order_price" label="订单价格" width="90px"></el-table-column>
         <el-table-column label="是否付款" width="90px">
            <template v-slot="scope">
               <el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
               <el-tag v-else type="success">已付款</el-tag>
            </template>
         </el-table-column>
         <el-table-column prop="is_send" label="是否发货" width="90px"></el-table-column>
         <el-table-column label="下单时间" width="180px">
            <template v-slot="scope">
               {{ scope.row.create_time | dateFormat}}
            </template>
         </el-table-column> 
         <el-table-column label="操作" width="160px">
            <template>
               <el-button size="mini" type="primary" icon="el-icon-edit" 
               @click="editDialogVisible = true"></el-button>
               <el-button size="mini" type="success" icon="el-icon-location-outline"
                @click="showProgressBox"></el-button>
            </template>
         </el-table-column>                                                           
      </el-table>
      <!-- -----------------------------页码显示区域------------------------------- -->
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
   <!-- 模拟功能而已，没有接口 -->
   <!-- -----------------------------点击编辑按钮显示区域------------------------------- -->
   <el-dialog title="修改地址" :visible.sync="editDialogVisible"
   @close="handleEditClosed">
      <el-form :model="editFormData" :rules="editFormDataRules" 
      ref="editForm" >
         <el-form-item label="省市区/县:" prop="address1">
            <el-cascader
               v-model="value"
               :options="cityData"
               :props="{ expandTrigger: 'hover' }"
               ></el-cascader>         
         </el-form-item>
         <el-form-item label="详细地址:" prop="address2">
            <el-input v-model="editFormData.address2"></el-input>
         </el-form-item>         
      </el-form>
      <span slot="footer">
         <el-button @click="editDialogVisible = false">取消</el-button>
         <el-button type="primary" @click="editDialogVisible = false">确定</el-button>         
      </span>
   </el-dialog>
   <!-- -----------------------------点击位置按钮显示区域------------------------------- -->
   <el-dialog title="物流进度" :visible.sync="locateDialogVisible"
   @close="handleLocateClosed">
      <el-timeline>
         <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.context}}
            {{activity.ftime}}
         </el-timeline-item>
      </el-timeline>       
 
   </el-dialog>   
</div>
    
</template>
<script>
import cityData from './city'
export default {
   data() {
      return {
         orderlist: [],
         queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 2
         },
         total: 0,
         editDialogVisible: false,
         locateDialogVisible: false,
         editFormData: {
            address1: [],
            address2: ''
         },
         editFormDataRules: {
            address1: [
               {required: true, message: '请选择区县',trigger: 'blur'}
            ],
            address2: [
               {required: true, message: '请填写详细地址',trigger: 'blur'}
            ]

         },
         value: [],
         // 省市区县数据项
         cityData,
         progressInfo: []
      }
   },
   created() {
      this.getOrderList();
   },
   methods: {
      // 获取所有的订单数据
      async getOrderList(){
         let {data: res} = await this.$http.get('orders',{params: this.queryInfo});
         if(res.meta.status != 200){
            return this.$message.error("获取数据失败");
         }else {
            this.orderlist = res.data.goods;
            this.total = res.data.total;
            this.$message.success("获取数据成功")
         }
      },
      // 处理页面显示数据项数的切换
      handleSizeChange(newSize){
         this.queryInfo.pagesize = newSize;
         this.getOrderList();
      },
      // 处理页码的切换
      handleCurrentChange(newPage){
         this.queryInfo.pagenum = newPage;
         this.getOrderList();
      },
      // 编辑框的关闭
      handleEditClosed(){
         this.$refs.editForm.resetFields();
      },
      // 地址信息面板关闭
      handleLocateClosed(){

      },
      // 触发地址信息获取按钮
      async showProgressBox(){
         this.locateDialogVisible = true;
         let {data: res} = await this.$http.get('/kuaidi/804909574412544580');
         if(res.meta.status != 200){
            return this.$message.error("获取物流信息失败")
         }else {
            this.progressInfo = res.data
            this.$message.success("获取物流信息成功")
         }
      }
   },
    
}
</script>
<style lang="less" scoped> 
.el-table {
   margin: 15px 0;
}

.el-cascader {
   width: 100%
}

</style>