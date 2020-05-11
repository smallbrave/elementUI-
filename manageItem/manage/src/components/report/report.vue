<template>
<div class="container">
    <!-- --------------  面包屑导航 ------------- -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>数据统计</el-breadcrumb-item>
       <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>    
    <el-card>
       <!------------------使用echarts画一个图表---------------------  -->
       <div id="main" style="width: 800px;height: 400px">

       </div>
    </el-card>
</div>    
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data() {
        return {
            // 需要合并的数据
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                    },
                    xAxis: [{
                        boundaryGap: false
                    }],
                    yAxis: [{
                        type: 'value'
                    }]
                }
            }
        },
    created() {
        
    },
    async mounted() {
        // 基于文档中的dom元素，实现echarts的初始化
        var myChart = echarts.init(document.getElementById('main'));
        
        // 获取图表数据
        let {data: res} = await this.$http.get('reports/type/1')
        if(res.meta.status != 200){
            return this.$message.error("获取图表信息失败")
        }
        let options = _.merge(res.data,this.options)   
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(options);
    },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}
</style>