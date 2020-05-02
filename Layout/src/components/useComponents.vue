<template>
  <el-container>
      <el-header>Header</el-header>
      <el-main>
          <!-- 使用input组件:因为input一般都是用于获取用户输入的，所以需要一个数据项；
          组件中，多使用v-model实现数据同视图的绑定 -->
          <el-input v-model="value1" placeholder="请输入内容"></el-input>
          <!-- 可设置disabled实现其为不可用 -->
          <el-input v-model="value2" placeholder="请输入内容" disabled></el-input>
          <!-- 可设置clearable实现内容可清除,这里的清除是在input方框中实现一个有内容可见的删除图标-->
          <el-input v-model="value3" placeholder="请输入内容" clearable></el-input>
          <!-- 通过设置show-password属性，实现一个密码可见框 -->
          <el-input v-model="value4" placeholder="请输入内容" show-password></el-input> 
          <!-- 在input框中实现自定义图标添加，分为prefix-icon（前）以及suffix-icon（后）  -->
          <!-- <el-input v-model="value1" placeholder="请输入内容" prefix-icon="el-icon-date"></el-input>
          <el-input v-model="value1" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>    -->
          <!--除此之外，还可以使用slot来完成上述操作  -->
          <el-input
            placeholder="请选择日期"
            v-model="value3">
          <i slot="suffix" class="el-input__icon el-icon-date"></i>
          </el-input>
          <el-input
            placeholder="请输入内容"
            v-model="value4">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!-- 之后还有类式： 文本域，就是设置其type为textarea即可，可动态设置:rows以决定文本域高度
          也可直接添加autosize属性，实现自适应文本高度的文本域；
          可通过size属性实现对input框大小的设定；
          可设置maxlength、minlength实现对输入内容的长度的限制，之后通过设置show-word-limit实现字数统计 -->


          <!-- select选择器 -->
          <!-- <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select> -->
          <!-- 可直接在el-select上添加multiple实现多选 -->
          <!-- <el-select v-model="value" multiple  placeholder="请选择">
              <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select> -->
          <!-- 可在el-select中设置filterable实现搜索功能 -->
          <el-select v-model="value" filterable  placeholder="请选择">
              <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <!-- 关于select的还有很多，可以之后多看看了  -->

          <!-- 级联菜单cascader ,注意，级联菜单中valuec为数组-->
          <el-cascader v-model="valuec" :options="options1" @change="handleChange"></el-cascader>

      </el-main>
      <el-footer>Footer</el-footer>
  </el-container>    
</template>
<script>
export default {
    name: 'useComponent',
    data() {
        return {
            value: '',
            valuec: [], 
            value1: '',
            value2: '',
            value3: '',
            value4: '',
            options: [
                {
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }
            ],
            options1: [
                {
                    value: '选项1',
                    label: '黄金糕',
                     children: [{
                            value: 'shejiyuanze',
                            label: '设计原则',
                            children: [{
                            value: 'yizhi',
                            label: '一致'
                            }, {
                            value: 'fankui',
                            label: '反馈'
                            }, {
                            value: 'xiaolv',
                            label: '效率'
                            }, {
                            value: 'kekong',
                            label: '可控'
                            }]
                     }]
                }, {
                    value: '选项2',
                    label: '双皮奶',
                    children: [{
                            value: 'cexiangdaohang',
                            label: '侧向导航'
                            }, {
                            value: 'dingbudaohang',
                            label: '顶部导航'
                            }]
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }
            ]
        }
    },
     methods: {
      handleChange(value) {
        console.log(value);
      }
      }
}
</script>
<style scoped>
.el-header,
.el-footer {
    line-height: 60px;
    background-color: aqua;
}

.el-main {
    height: 400px;
    background-color: #ccc;
}
</style>