<template>
  <div class="login-form">
    <div class="login-box">
      <div class="icon" style="margin-bottom:10px">
        <img src="../assets/1.png" height="40" style="vertical-align: middle;"/><span style="font-weight:500;">小破盘</span>
      </div>
      <el-tabs type="border-card" :stretch="true">
        <el-tab-pane label="登录">
            <el-input type="text" v-model="login.username" autocomplete="off" style="margin:15px 0 25px 0" placeholder="请输入邮箱"></el-input>
            <el-input type="password" v-model="login.password" autocomplete="off" style="margin-bottom:25px" placeholder="请输入密码"></el-input>
            <el-button type="primary" @click="loginForm" style="width:100%;margin-bottom:25px">登录</el-button>
        </el-tab-pane>
        <el-tab-pane label="注册">
          <el-input type="text" v-model="register.username" autocomplete="off" style="margin:15px 0 25px 0" placeholder="请输入邮箱"></el-input>
          <el-input type="password" v-model="register.password" autocomplete="off" style="margin-bottom:25px" placeholder="请输入密码"></el-input>
          <el-input type="text" v-model="register.nickname" autocomplete="off" style="margin-bottom:25px" placeholder="请输入昵称"></el-input>
          <el-col>
            <el-input type="text" v-model="register.yanzhengma" autocomplete="off" style="margin-bottom:25px;width:63%" placeholder="请输入验证码"></el-input>
            <el-button type="primary" @click="sendAnPwd" style="font-size:13px">获取验证码</el-button>
          </el-col>
          <el-button type="primary" @click="submitForm" style="width:100%;margin-bottom:25px">注册</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { Login,sendPwd,Register } from '../api/login'
import { getUserInfo } from '../api/users'
import { getPassMD5 } from '../utils/cryto'
export default {
  data() {
    return {
      login: {
        password: '',
        username: '',
      },
      register:{
        password: '',
        username: '',
        nicheng:'',
        yanzhengma:''
      }
    };
  },
  methods: {

    // 发送验证码
    sendAnPwd(){
      sendPwd({username:this.register.username}).then(res=>{
        this.$message({ message: res.message,type: 'success' });
      })
    },

    // 注册账户
    submitForm() {
      let { username,password,nickname,yanzhengma }= this.register
      Register({
        username,password:getPassMD5(password),nickname,yanzhengma
      }).then(res=>{
        this.$message({ message: res.message,type: 'success' });
      })
    },

    // 登录
    loginForm(){
      let {password,username} = this.login
      if(password != '' && username != ''){
        Login({password:getPassMD5(password),username}).then(res=>{

          this.$message({ message: res.message, type: 'success' });

          this.$store.state.userInfo = res.data[0]

          getUserInfo({drive_id:this.$store.state.userInfo.drive_id}).then(res=>{
            localStorage.setItem('userInfo',JSON.stringify(res.data[0]))
          })
          setTimeout(()=>{
            localStorage.setItem('token',1111111)
            this.$router.push('/drive/file')
          },1500)
        }).catch(err=>{
          this.$message({ message: err.message, type: 'error' });
        })
      }else{
        this.$message({
          message: '手机号或密码不能为空',
          type: 'error'
        });
      }
    }
  },
};
</script>

<style lang="less" scoped>
.login-form{
    width: 100vw;
    height: 100vh;
    background-color: #EBEFFE;
    .login-box{
      width: 350px;
      border-radius: 10px;
      text-align: center;
      position: absolute;
      overflow: hidden;
      right: 200px;top: 50%;
      transform: translateY(-50%);
      .el-tabs--border-card{
        background-color: #fff;
      }
    }
}
</style>