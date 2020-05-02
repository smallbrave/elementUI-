<template>
  <el-container direction="vertical">
      <el-alert type="success"
      title="这是一个成功的象征"
      ></el-alert>
      <el-alert type="info"
      title="这是有一个提示"
      ></el-alert>
     
     <!-- 使用effect设置背景色 -->
      <el-alert type="success"
      title="这是一个成功的象征"
      
      effect="dark"
      ></el-alert>
      <el-alert type="success"
      title="这是一个成功的象征"
      
      effect="light"
      ></el-alert> 

      <!--使用description设置辅助文字  -->
      <el-alert type="success"
      title="这是一个成功的象征" 
      effect="dark"

      description="这是一些辅助性的文字"
      ></el-alert>

      <!-- 设置closable（boolean值），实现提示框是否可关闭 -->
      <el-alert type="success"
      title="这是一个成功的象征"
      effect="dark"

      :closable="false"
      ></el-alert>

      <!-- 此外，可以设置close-text（值为字符串）为关闭处的文字；此外，可以添加@close事件监听器 -->
      <el-alert type="success"
      title="这是一个成功的象征"
      effect="dark"

      close-text="知道了"
      ></el-alert>
      <!-- 可以为提示框添加小图标：show-icon;设置center使文本居中 -->
      <el-alert type="success"
      title="这是一个成功的象征"
      effect="dark"

      show-icon
      center
      ></el-alert>
      

      <!-- 在button中设置事件，使用$message显示弹窗 -->
      <el-container>
        <el-button  @click="open">弹窗</el-button>
        <el-button  @click="open1">弹窗1</el-button>
        <el-button  @click="open2">弹窗2</el-button>
        <el-button  @click="open3">弹窗3</el-button>
      </el-container>

      <!-- 在button中设置事件，使用$alert全屏显示弹窗 -->
      <el-container>
        <el-button  @click="open4">提示弹框（alert）</el-button>
        <el-button  @click="open5">确认弹框（confirm）</el-button>
        <!-- 此外还有输入框$prompt; -->
      </el-container>

      <!-- 通知栏，从窗口左右划出；使用$notify -->
      <el-container>
        <el-button @click="open6"> 通知栏</el-button> 
      </el-container>
  </el-container>
</template>
<script>
export default {
    methods: {
        // 设置showClose: true使提示框可以手动关闭
        open(){
            this.$message({
                // message中设置要显示的内容
                message: "设置内容",
                // 使用type设置这个提示框的属性
                type: "success",
                showClose: true 
            });
        },
        // center: true可实现文字居中
        open1(){
            this.$message({
                // message中设置要显示的内容
                message: "设置内容",
                // 使用type设置这个提示框的属性
                type: "warning",
                center: true 
            });
        },
        open2(){
            this.$message({
                // message中设置要显示的内容
                message: "设置内容",
                // 使用type设置这个提示框的属性
                type: "error" 
            });
        },
        open3(){
            this.$message({
                // message中设置要显示的内容
                message: "设置内容",
                // 使用type设置这个提示框的属性
                type: "info" 
            });
        },
        open4(){
            //$alert用于消息提示 
            this.$alert("内容设置","标题设置",{
                // 弹框中的逻辑
                //内有确认按钮，并设置其内容
                confireButtonText: '确定',
                
                //设置callback，显示执行玩上面的操作后又做啥
                callback: action =>{
                    this.$message({
                    type: 'info',
                    message: `action: ${ action }`
                    })
                }
            })
        },
        open5(){
            //$confirm用于消息确认 
            this.$confirm("内容设置","标题设置",{
                // 弹框中的逻辑
                //内有确认按钮，并设置其内容
                confireButtonText: '确定',
                //取消按钮，并设置其内容
                cancelButtonText: '取消',
                //类型设置
                type: 'info'
            }).then(()=>{
                //可使用then对完成上述操作后会做啥
                this.$message({
                type: 'success',
                message: '删除成功!'
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
          });          
        });
        },
        open6(){
            this.$notify({
                //title设置一个标题，message设置具体内容
                title: "通知",
                message: '这是一条不会自动关闭的消息',
                // duration设置关闭的时间间隔,设置为0就不会自动关闭，默认其4500ms
                duration: 500,
                //设置type来决定其类型
                type: "success",
                //通过position设置其出现的位置
                //top-left 、top-right、bottom-right、bottom-left
                position: "bottom-left",
                //通过offset设置其偏移(垂直方向)
                offset: 100
            })
        }
    },
}
</script>
<style scoped>
.el-alert {
    margin: 10px 0;
}
</style>