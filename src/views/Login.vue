<template>
  <div class="login-form">
    <div class="login-big-box">
      <login-left-area />
      <div class="login-box">
        <div class="icon" style="margin-bottom: 10px">
          <img
            src="../assets/icon.png"
            height="40"
            style="vertical-al ign: middle"
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
                >
                  <template slot="append">
                    <el-select
                      v-model="login.emailSelect"
                      slot="prepend"
                      style="width: 130px"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in emailArr"
                        :key="item.id"
                        :label="item.email"
                        :value="item.email"
                      ></el-option>
                    </el-select>
                  </template>
                </el-input>
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
                <!-- <el-input
                  type="text"
                  v-model="register.username"
                  autocomplete="off"
                  placeholder="请输入邮箱"
                  clearable
                ></el-input> -->
                <el-input
                  v-model="register.username"
                  autocomplete="off"
                  placeholder="请输入邮箱"
                >
                  <template slot="append">
                    <el-select
                      v-model="register.emailSelect"
                      slot="prepend"
                      style="width: 130px"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in emailArr"
                        :key="item.id"
                        :label="item.email"
                        :value="item.email"
                      ></el-option>
                    </el-select>
                  </template>
                </el-input>
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
                    :disabled="isClick"
                    @click="sendAnPwd()"
                    style="font-size: 13px; min-width: 107px"
                    v-loading="isLoading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.5)"
                    class="btn"
                    >{{ tipText }}</el-button
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
      ©{{ fullYear }} 小破盘
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
        emailSelect: "@qq.com",
      },
      emailArr: [
        { email: "@qq.com", id: "001" },
        { email: "@gmail.com", id: "002" },
        { email: "@136.com", id: "003" },
        { email: "@139.com", id: "004" },
        { email: "@yahoo.com", id: "005" },
        { email: "@msn.com", id: "006" },
      ],
      register: {
        password: "",
        username: "",
        nicheng: "",
        yanzhengma: "",
        emailSelect: "@qq.com",
      },
      rules: {
        username: [
          { required: true, message: "邮箱是必须的", trigger: "blur" },
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
      tipText: "获取验证码",
      isLoading: false,
      isClick: false,
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
      let { username, emailSelect } = this.register;
      let account = username + emailSelect;
      if (reg.test(account)) {
        this.isLoading = true;
        this.isClick = true;
        sendPwd({ username: account }).then((res) => {
          this.$message({ message: res.message, type: "success" });
          this.isLoading = false;
          this.setTipText();
        });
      } else {
        this.$message.error("邮箱格式不正确");
      }
    },

    // 注册账户
    submitForm(formName) {
      let { username, password, nickname, yanzhengma, emailSelect } =
        this.register;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Register({
            username: username + emailSelect,
            password: getPassMD5(password),
            nickname,
            yanzhengma,
          }).then((res) => {
            let { message, status } = res;
            if (status == -1)
              this.$message({ message: message, type: "error" });
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
      let { password, username, emailSelect } = this.login;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            let { status, message, token } = await Login({
              password: getPassMD5(password),
              username: username + emailSelect,
            });
            if (status == 200) {
              this.$message({ message, type: "success" });
              localStorage.setItem("token", token);

              setTimeout(() => {
                this.$router.push("/drive/file");
              }, 1500);
            } else {
              this.$message({ message, type: "error" });
              this.login.password = "";
              this.login.username = "";
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    setTipText() {
      let second = 60;
      let timer = setInterval(() => {
        this.tipText = second;
        second -= 1;
        if (second <= 0) {
          clearInterval(timer);
          this.isClick = false;
          this.tipText = "重新获取";
        }
      }, 1000);
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
  color: #000;
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
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        margin-right: 20px;
      }
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