<template>
<div class="conatiner">
    <!-- --------------  面包屑导航 ------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods'}">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>    
    <!-- ------------------ 卡片视图区域 ----------------- -->
    <el-card>
        <!-- 顶部提示文字 -->
        <el-alert type="info" center
        title="添加商品信息" show-icon :closable="false"></el-alert>
        <!-- 步骤指示区域  -->
        <!-- :active标识激活项，其中每一个el-step都是一个项，从0开始 -->
        <!-- 通过"-0"操作，将字符=>数字 -->
        <el-steps align-center :active="activeIndex - 0" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
        label-position="top">
            <!-- tabs栏区域 -->
            <!-- v-model这儿绑定的activeIndex是一个字符串 -->
            <el-tabs tab-position="left" v-model="activeIndex" 
            :before-leave="beforeTabLeave" @tab-click="tabClick">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name" >
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price" >
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight" >
                        <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number" >
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" >
                        <span>选择商品分类：</span>
                        <el-cascader
                            v-model="addForm.goods_cat"
                            :options="catelist"
                            :props="cascaderProp"
                            @change="handleChange"></el-cascader>                            
                    </el-form-item>                                                                                    
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <!-- 渲染表单的动态参数=>tab选中商品参数时 -->
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData"
                    :key="item.attr_id">
                        <!-- 复选框组 -->
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="item2" v-for="(item2,index) in item.attr_vals"
                            :key="item2+''+ index" border></el-checkbox>
                        </el-checkbox-group>                    
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <!-- 渲染表单的静态属性=>tab选中商品属性时 -->
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
                    :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                <!-- ------------------图片上传--------------- -->
                <!-- action指定上传到那个地址 -->
                <!-- :on-preview 预览图片事件 -->
                <!-- :on-remove 删掉图片处理 -->
                <el-upload
                action="http://timemeetyou.com:8889/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headerObj"
                :on-success="handleSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- -----------富文本编辑器------------ -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <el-button type="primary" @click="add">添加商品</el-button>
                </el-tab-pane>            
            </el-tabs>   
        </el-form>
    </el-card>
    <!-- ------------------------------------ 图片预览面板 ---------------------------- -->
    <el-dialog title="图片预览" :visible.sync="previewVisibleDialog" width="50%">
        <img :src="previewPath" alt="图片加载失败">
    </el-dialog>    
</div>    
</template>
<script>
export default {
    data() {
        return {
            activeIndex: 0,
            addForm:{
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属分类
                goods_cat: [],
                pics: [],
                // 商品的详情描述
                goods_introduce: '',
                //用于存储manyTableData和onlyTableData
                //之后会用于发送请求
                attrs: []
            },
            addFormRules:{
                goods_name: [
                    {required: true, message: '名称不能为空',trigger: 'blur'}
                ],
                goods_price: [
                    {required: true,message: '价格必填',trigger: 'blur'}
                ],
                goods_weight: [
                    {required: true,message: '重量必填',trigger: 'blur'}
                ],
                goods_number: [
                    {required: true, message: '数目必填',trigger: 'blur'}
                ]
            },
            // 商品分类列表数据
            catelist: [],
            // 级联选择器的 :prop属性值
            cascaderProp: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 动态参数列表
            manyTableData: [],
            // 静态参数列表
            onlyTableData: [],
            // upload的headers设置项
            headerObj:{
                Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片地址
            previewPath:'',
            // 图片预览的面板显示状态
            previewVisibleDialog: false
         }
    },
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            let {data: res} = await this.$http.get('categories');
            if(res.meta.status != 200){
                return this.$message.error("获取商品分类数据失败")
            }else {
                this.catelist = res.data;
            }
        },
        // 级联选择器选中项变化处理
        handleChange(){
            if(this.addForm.goods_cat.length != 3){
                this.addForm.goods_cat = [];
            }
        },
        // tab切换处理
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName == '0' && this.addForm.goods_cat.length != 3){
                this.$message.error("请选择商品分类")
                // 可以阻止tab的切换
                return false
            }
        },

        // tab点击事件
        async tabClick(){
            if(this.activeIndex == '1'){
                // 获取动态参数
                let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params: {sel: 'many'}
                })
                if(res.meta.status != 200){
                    return this.$message.error("获取动态参数列表失败")
                }else{
                    res.data.forEach((item)=>{
                        item.attr_vals = item.attr_vals.length>0?(item.attr_vals.split(" ")):[]
                    })
                    this.manyTableData = res.data
                }
            }else if(this.activeIndex == '2'){
                // 获取静态属性
                let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params: {sel: 'only'}
                })
                if(res.meta.status != 200){
                    return this.$message.error("获取静态属性失败")
                }else {
                    this.onlyTableData = res.data;
                }
            }
        },
        // 监听图片上传成功
        //可以拿到图片上传成功后的返回值
        handleSuccess(response){
            let picInfo = {
                pic: response.data.tmp_path
            }
            this.addForm.pics.push(picInfo);
            console.log(this.addForm);
        },
        // 图片预览
        handlePreview(file){
            // 获取图片的真是地址
            this.previewPath = file.response.data.url;
            this.previewVisibleDialog = true;
            
        },
        // 图片删除
        // file为将会被移除的图片的信息
        handleRemove(file){
            // 获取当前图片的临时路径
            let filePath = file.response.data.tmp_path;
            // 在数组中查找当前路径的索引值
            let index = this.addForm.pics.findIndex((item)=>{
                return item.pic == filePath;
            })
            // 移除数组中的该图片路径
            this.addForm.pics.splice(index,1);
        },
        // 商品内容中的添加 商品按钮 处理事件
        add(){
            this.$refs.addFormRef.validate(async (valid)=>{
                if(valid){
                    let dataForm = JSON.parse(JSON.stringify(this.addForm));
                    dataForm.goods_cat = dataForm.goods_cat.join(",");
                    // 处理动态参数/静态属性
                    this.manyTableData.forEach((item)=>{
                        let newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(" ")
                        };
                        this.addForm.attrs.push(newInfo)
                    })
                    this.onlyTableData.forEach((item)=>{
                        let newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        };
                        this.addForm.attrs.push(newInfo)
                    })
                    dataForm.attrs = this.addForm.attrs;
                    // 发起请求添加商品
                    let {data: res} = await this.$http.post('goods', dataForm)
                    if(res.meta.status != 201){
                        return this.$message.error(res.meta.msg)
                    }else {
                        this.$message.success("新建商品成功")
                        this.$router.replace('/goods')
                        this.getCateList()
                    } 
                }else {
                    return this.$message.error("请填写必要的表单项")
                }
            })
        }
    },
    computed: {
        cateId(){
            if(this.addForm.goods_cat.length == 3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
}
</script>
<style lang="less" >
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

.el-steps {
    margin: 15px 0;
}

.el-step__title {
    font-size: 14px!important;
}

.el-checkbox {
    margin: 0 10px 0 0!important;
}

img {
    max-width: 100%;
}

.ql-editor {
    min-height: 300px;
}

.el-button {
    margin-top: 15px;
}
</style>