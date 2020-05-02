<template>
  <div class="login_container">
    <div class="login_box">
        <!-- logo -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="图片加载失败">   
        </div>
        <!-- 登录框  -->
        <el-form ref="loginFormRef" :model="loginForm" 
        :rules="loginFormRules" class="login_form" >
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" 
                show-passWord prefix-icon="el-icon-key"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>  
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            loginForm: {
                username: "admin",
                password: "123456"
            },
            loginFormRules: {
                username: [
                    {required: true,message: "账户名不能为空", trigger: "blur"},
                    {min: 3,max: 10,message: "长度在3-10之间",trigger: "blur"}
                ],
                password: [
                    {required: true,message: "密码不能为空", trigger: "blur"},
                    {min: 3,max: 10,message: "长度在3-10之间",trigger: "blur"}
                ]
            }
        }
    },
    methods: {
        //以下两个方法都需要使用到form这个dom元素 

        // resetFields函数，重置整个form
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            // validate函数，接受一个回调函数，回调函数的第一个参数是验证结果（boolean）
            this.$refs.loginFormRef.validate((valid)=>{
                if(valid) {
                    this.$http.post('login',this.loginForm)
                    .then((res)=>{
                        if(res.data.meta.status == 200){
                            window.sessionStorage.setItem('token',res.data.data.token);
                            this.$message({
                                type: 'success',
                                message: "登录成功"
                            });
                            this.$router.push('/home');
                        }else {
                            this.$message({
                             type: 'error',
                             message: "失败成功"    
                            })
                        }
                    })
                }
            })
        }
    },
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar_box {
            margin: -65px auto ;
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px #ddd;
            img {
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    
    .btns {
        display: flex;
        justify-content: flex-end;
    }
}

</style>