<script>
import { modifyNick, modifyPass } from "../../api/users";
import { uploadHeadImg } from "../../api/file";
import { getPassMD5 } from "../../utils/cryto";
import { mapState } from "vuex";
export default {
  data() {
    return {
      nickNameDialog: false,
      dialogFormVisible: false,
      modify: {
        newPass: null,
        conPass: null,
        oldPass: null,
      },
      nickname: null,
      customColor: "",
    };
  },
  computed: {
    percentage() {
      let { drive_used, drive_size } = this.userInfo;
      let result = parseInt((drive_used / drive_size) * 100) / 100;
      this.percentageStatua(result);
      return result > 1 ? 1 : result;
    },
    ...mapState("user", ["userInfo"]),
    ...mapState("sideBar", ["rules", "routers", "isCollapse"]),
  },
  filters: {
    getBToMB(num) {
      return parseInt(num / 1024 / 1024);
    },
    getBToGB(num) {
      return parseInt(num / 1024 / 1024 / 1024);
    },
  },
  methods: {
    percentageStatua(result) {
      if (result < 0.6) {
        this.customColor = "#409EFF";
      } else if (result >= 0.6 && result < 0.8) {
        this.customColor = "#E6A23C";
      } else {
        this.customColor = "#F56C6C";
      }
    },

    format(percentage) {
      return `${percentage}%`;
    },

    // 上传头像
    handel() {
      this.$refs.fileEle.click();
    },

    // 上传头像
    uploadFile(e) {
      let that = this;
      var files = e.target.files[0];
      if (!files) return false;
      if (files.size > 5 * 1024 * 1024)
        return this.$message.warning("仅支持5M以内图片");
      if (!files.type.includes("image"))
        return this.$message.warning("仅支持image/*图片");
      var filename = files.name;
      var reader = new FileReader();
      var { drive_id } = this.userInfo;
      reader.onload = async function () {
        let { head_img_url, message, status } = await uploadHeadImg({
          chunk: reader.result,
          filename,
          drive_id,
        });
        if (status == 200) {
          that.$message({ type: "success", message });
          that.userInfo.headImg = head_img_url;
        }
      };
      reader.readAsDataURL(files);
    },

    // 修改用户昵称
    modify_nick() {
      this.nickNameDialog = !this.nickNameDialog;
      this.nickname = this.userInfo.nickname;
    },

    // 修改用户昵称
    updateNick() {
      modifyNick({
        drive_id: this.userInfo.drive_id,
        nickname: this.nickname,
      })
        .then((data) => {
          let { status, message } = data;
          if (status == 200) {
            this.$message.success(message);
            this.userInfo.nickname = this.nickname;
            // 关闭遮罩层
            this.nickNameDialog = !this.nickNameDialog;
          } else {
            this.$message.warning(message);
          }
        })
        .catch((err) => {
          this.$message.warning(err.message);
        });
    },

    // 修改密码
    openModfityPass() {
      this.dialogFormVisible = true;
    },

    // 修改密码
    updataPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.modify.newPass === this.modify.conPass) {
          this.dialogFormVisible = false;
          let { drive_id } = this.userInfo;
          modifyPass({
            password: getPassMD5(this.modify.newPass),
            drive_id,
          }).then((res) => {
            let { status, message } = res;
            if (status == 200) {
              this.$message.success(message);
              localStorage.removeItem("token");
              this.$router.replace("/login");
            } else {
              this.$message.error(message);
            }
          });
        }
      });
    },

    // 退出
    loginOut() {
      localStorage.removeItem("token");
      this.$router.replace({ path: "/login" });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<template>
  <div class="side-nav">
    <div class="icon" style="margin-bottom: 10px">
      <img src="../../assets/icon.png" height="60" v-show="!isCollapse" /><span
        >小破盘</span
      >
    </div>
    <el-menu
      default-active="/drive/file"
      class="el-menu-vertical-demo"
      active-text-color="#409EFF"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-menu-item
        :index="item.path"
        v-for="(item, index) in routers"
        :key="index"
        :disabled="item.disable"
        @click="$router.push(item.path)"
      >
        <i :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </el-menu>
    <div class="footer" v-show="!isCollapse">
      <div class="content">
        <span>
          {{ userInfo.drive_used | getBToMB }}
          MB/{{ userInfo.drive_size | getBToGB }}GB</span
        >
        <el-progress
          v-if="!isNaN(percentage)"
          :percentage="percentage * 100"
          :color="customColor"
          :format="format"
          class="jindutiao"
        ></el-progress>
      </div>
      <div class="user_info">
        <div class="head">
          <img :src="userInfo.headImg" alt="" />
        </div>
        <div class="nicheng">
          <span>{{ userInfo.nickname }}</span>
        </div>
        <div class="set">
          <el-popover placement="top" trigger="click" class="popover">
            <i slot="reference" class="iconfont el-icon-setting"></i>
            <ul class="menu">
              <li @click="handel">更换头像</li>
              <input
                type="file"
                ref="fileEle"
                @change="uploadFile"
                accept="image/*"
                style="display: none"
              />
              <li @click="modify_nick">修改昵称</li>
              <li @click="openModfityPass">修改密码</li>
              <li>关于</li>
              <li @click="loginOut">退出登录</li>
            </ul>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="nickname">
      <el-dialog
        title="修改昵称"
        :visible.sync="nickNameDialog"
        width="30%"
        center
      >
        <el-input v-model="nickname" placeholder="请输入新的昵称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="nickNameDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateNick">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="modfityPass">
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="40%">
        <el-form :model="modify" :rules="rules" ref="modifyPass">
          <el-form-item label="原密码" label-width="120px" prop="oldPass">
            <el-input
              v-model="modify.oldPass"
              autocomplete="off"
              placeholder="请输入原密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" label-width="120px" prop="oldPass">
            <el-input
              v-model="modify.newPass"
              autocomplete="off"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" label-width="120px" prop="oldPass">
            <el-input
              v-model="modify.conPass"
              autocomplete="off"
              placeholder="请再次输入新密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updataPass('modifyPass')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.side-nav {
  width: 99%;
  height: 100%;
  border-right: solid 1px #e6e6e6;
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    img {
      margin-right: 10px;
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    .content {
      padding: 0 10px 10px 20px;
      font-size: 13px;
      border-bottom: 1px solid #444;
      .jindutiao /deep/ i {
        display: none;
      }
    }
    .user_info {
      padding: 20px 10px 20px 10px;
      display: flex;
      .head {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .nicheng {
        height: 50px;
        width: 80px;
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        line-height: 50px;
        font-weight: 500;
        font-size: 14px;
        margin-right: 30px;
      }
      .set {
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        font-size: 19px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>