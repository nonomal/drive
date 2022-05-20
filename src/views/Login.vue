<template>
  <div class="login-form">
    <div class="login-big-box">
      <login-left-area />
      <div class="login-box">
        <div class="icon" style="margin-bottom: 10px">
          <img
            src="../assets/icon.png"
            height="40"
            style="vertical-align: middle"
          /><span style="font-weight: 500">小破盘</span>
        </div>
        <el-tabs type="border-card" :stretch="true">
          <el-tab-pane label="登录">
            <el-form :model="login" :rules="rules" ref="ruleForm">
              <el-form-item prop="username">
                <el-input
                  v-model="login.username"
                  autocomplete="off"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="login.password"
                  autocomplete="off"
                  type="password"
                  placeholder="请输入密码"
                  @keyup.enter.native="loginForm('ruleForm')"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="loginForm('ruleForm')"
                  style="width: 100%"
                  >登录</el-button
                >
              </el-form-item>
              <el-row>
                <el-col :span="6" :offset="16">
                  <el-link
                    href="/modifyCipher"
                    icon="el-icon-link"
                    style="margin-top: -12px"
                    target="_blank"
                    >忘记密码</el-link
                  >
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册">
            <el-form :model="register" :rules="rules" ref="register">
              <el-form-item prop="username">
                <el-input
                  type="text"
                  v-model="register.username"
                  autocomplete="off"
                  placeholder="请输入邮箱"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="register.password"
                  autocomplete="off"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="nickname">
                <el-input
                  type="text"
                  v-model="register.nickname"
                  autocomplete="off"
                  clearable
                  placeholder="请输入昵称"
                ></el-input>
              </el-form-item>
              <el-col>
                <el-form-item prop="yanzhengma">
                  <el-input
                    type="text"
                    v-model.number="register.yanzhengma"
                    autocomplete="off"
                    style="width: 63%"
                    maxlength="4"
                    placeholder="请输入验证码"
                  ></el-input>
                  <el-button
                    type="primary"
                    :disabled="isLoading"
                    @click="sendAnPwd()"
                    style="font-size: 13px"
                    v-loading="isLoading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.5)"
                    class="btn"
                    >获取验证码</el-button
                  >
                </el-form-item>
              </el-col>
              <el-button
                type="primary"
                @click="submitForm('register')"
                style="width: 100%"
                >注册</el-button
              >
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <p class="icp">
      ©{{ fullYear }} 小破盘 版权所有
      <a href="//beian.miit.gov.cn">豫ICP备20017833号</a>
    </p>
  </div>
</template>

<script>
import { Login, sendPwd, Register } from "../api/login";
import { getPassMD5 } from "../utils/cryto";
import LoginLeftArea from "../components/LoginLeftArea/LoginLeftArea.vue";
export default {
  data() {
    return {
      login: {
        password: "",
        username: "",
      },
      register: {
        password: "",
        username: "",
        nicheng: "",
        yanzhengma: "",
      },
      rules: {
        username: [
          { required: true, message: "邮箱是必须的", trigger: "blur" },
          { validator: this.usernameValid, trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码是必须的", trigger: "blur" },
          {
            min: 8,
            max: 14,
            message: "长度不对哦！长度应在8-14之间",
            trigger: "blur",
          },
        ],
        nickname: [
          { required: true, message: "昵称是必须的", trigger: "blur" },
          { min: 3, max: 10, message: "昵称再长些呢！", trigger: "blur" },
        ],
        yanzhengma: [
          { required: true, message: "验证码是必须的", trigger: "blur" },
          { type: "number", message: "必须为数字值" },
        ],
      },
      isLoading: false,
    };
  },
  computed: {
    fullYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    // 发送验证码
    sendAnPwd() {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
      if (reg.test(this.register.username)) {
        this.isLoading = true;
        sendPwd({ username: this.register.username }).then((res) => {
          this.$message({ message: res.message, type: "success" });
          this.isLoading = false;
        });
      } else {
        this.$message.error("邮箱格式不正确");
      }
    },

    // 注册账户
    submitForm(formName) {
      let { username, password, nickname, yanzhengma } = this.register;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Register({
            username,
            password: getPassMD5(password),
            nickname,
            yanzhengma,
          }).then((res) => {
            let { message, status } = res;
            console.log(status);
            if (status == 0) this.$message({ message: message, type: "error" });
            else {
              this.$message({ message: message, type: "success" });
              this.$router.go(0);
            }
          });
        }
      });
    },

    // 登录
    loginForm(formName) {
      let { password, username } = this.login;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let { status, message, token } = await Login({
              password: getPassMD5(password),
              username,
            });
            if (status == 200) {
              this.$message({ message, type: "success" });
              localStorage.setItem("token", token);

              setTimeout(() => {
                this.$router.push("/drive/file");
              }, 1500);
            } else {
              this.$message({ message, type: "error" });
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    // username验证回调
    usernameValid(rule, value, callback) {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
      if (!reg.test(value)) {
        callback(new Error("邮箱格式不正确！"));
      }
      callback();
    },
  },
  components: {
    LoginLeftArea,
  },
};
</script>

<style lang="less" scoped>
.login-form {
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: #ebeffe;
  .login-big-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    padding: 30px 20px 60px 20px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  .login-box {
    width: 350px;
    border-radius: 10px;
    text-align: center;
    overflow: hidden;
    right: 200px;
    .el-tabs--border-card {
      background-color: #fff;
    }
  }
  .icp {
    font-size: 14px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    color: #8f9bb2;
    transform: translateX(-50%);
    a {
      text-decoration: none;
      color: #8f9bb2;
    }
  }
}
.btn /deep/ .el-loading-spinner {
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
}
</style>