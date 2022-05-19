<template>
  <div class="modifyCipher">
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
        <h2 id="title">修改密码</h2>
        <el-form :model="modifyUser" :rules="rules" ref="modifyUser">
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="modifyUser.username"
              autocomplete="off"
              placeholder="请输入邮箱"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input
              type="password"
              v-model="modifyUser.newPassword"
              autocomplete="off"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="cPassword">
            <el-input
              type="password"
              v-model="modifyUser.cPassword"
              autocomplete="off"
              placeholder="确认新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="yanzhengma">
            <el-row :gutter="15">
              <el-col :span="16">
                <el-input
                  type="text"
                  v-model.number="modifyUser.yanzhengma"
                  autocomplete="off"
                  maxlength="4"
                  placeholder="请输入验证码"
                ></el-input>
              </el-col>
              <el-col :span="4">
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
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="modifyForm('modifyUser')"
              style="width: 100%"
              >修改</el-button
            >
          </el-form-item>
          <el-row>
            <el-col :span="6" :offset="16">
              <el-link
                @click="goBack"
                icon="el-icon-link"
                style="margin-top: -12px"
                target="_blank"
                >返回登录</el-link
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { sendPwd } from "../api/login";
import { modifyPass } from "../api/users";
import { getPassMD5 } from "../utils/cryto";
import LoginLeftArea from "../components/LoginLeftArea/LoginLeftArea.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      modifyUser: {
        cPassword: "",
        newPassword: "",
        yanzhengma: "",
        username: "",
      },
      rules: {
        username: [
          { required: true, message: "邮箱是必须的", trigger: "blur" },
          { validator: this.usernameValid, trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "密码是必须的", trigger: "blur" },
          {
            min: 8,
            max: 14,
            message: "长度不对哦！长度应在8-14之间",
            trigger: "blur",
          },
        ],
        cPassword: [
          { required: true, message: "密码是必须的", trigger: "blur" },
          {
            min: 8,
            max: 14,
            message: "长度不对哦！长度应在8-14之间",
            trigger: "blur",
          },
          {
            validator: this.cpasswordValid,
            trigger: "blur",
          },
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
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    // 发送验证码
    sendAnPwd() {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
      if (reg.test(this.modifyUser.username)) {
        this.isLoading = true;
        sendPwd({ username: this.modifyUser.username }).then((res) => {
          this.$message({ message: res.message, type: "success" });
          this.isLoading = false;
        });
      } else {
        this.$message.error("邮箱格式不正确");
      }
    },
    modifyForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyPass({
            password: getPassMD5(this.modifyUser.newPassword),
            username: this.modifyUser.username,
          })
            .then((data) => {
              if (data.status !== 200) return this.$message.error(data.message);
              this.$message.success(data.message);
              setTimeout(() => {
                window.close();
              }, 1000);
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    goBack() {
      window.close();
    },
    // username验证回调
    usernameValid(rule, value, callback) {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g;
      if (!reg.test(value)) {
        callback(new Error("邮箱格式不正确！"));
      }
      callback();
    },
    //确认密码验证回调
    cpasswordValid(rule, value, callback) {
      if (this.modifyUser.newPassword !== value) {
        callback(new Error("两次密码不相同！"));
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
.modifyCipher {
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
    #title {
      margin: 10px 0;
      text-align: center;
      font-size: 18px;
    }
  }
  .login-box {
    width: 350px;
    border-radius: 10px;
    text-align: center;
    overflow: hidden;
    right: 200px;
    padding: 25px 20px;
    border-radius: 0px;
    background-color: #fff;
    .el-tabs--border-card {
      background-color: #fff;
    }
  }
}
.btn /deep/ .el-loading-spinner {
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
}
</style>