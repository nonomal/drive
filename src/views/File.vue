<template>
  <div class="File">
    <el-row :gutter="20" style="margin: 20px 0 20px">
      <el-col :span="12">
        <input
          type="file"
          ref="fileEle"
          @change="upload"
          style="display: none"
        />
        <el-button
          type="primary"
          @click="$refs.fileEle.click()"
          style="margin-right: 15px"
          ><i class="el-icon-upload el-icon--left"></i>上传</el-button
        >

        <el-popover placement="top" trigger="click" class="popover">
          <el-button slot="reference"
            ><i class="el-icon-plus el-icon--left"></i>新建</el-button
          >
          <ul class="menu">
            <li @click="centerDialogVisible = true">
              <i class="el-icon-folder-add el-icon--left"></i>新建文件夹
            </li>
            <li><i class="el-icon-document-add el-icon--left"></i>新建文件</li>
          </ul>
        </el-popover>
        <el-button style="margin-left: 15px"
          ><i class="el-icon-finished el-icon--left"></i>全选</el-button
        >
      </el-col>
      <el-col :span="3" :offset="6">
        <el-input
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
          v-model="searchWord"
          @keydown.enter.native="searchFile"
        ></el-input>
      </el-col>
    </el-row>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
          <span class="nav_link" @click="goBack(item, index)">{{
            item.name
          }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="fileList">
      <Folder ref="folder" :searchFileItem="searchFileItem"></Folder>
    </div>
    <transition name="slide-fade">
      <div
        class="footerMenu"
        v-show="footerMenuShow"
        @click="footerMenuShow = !footerMenuShow"
      >
        <div class="footItem">
          <el-tooltip
            class="item"
            effect="dark"
            content="下载"
            placement="top-start"
          >
            <el-button icon="el-icon-download"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="收藏"
            placement="top-start"
          >
            <el-button icon="el-icon-star-off"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="转发"
            placement="top-start"
          >
            <el-button icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top-start"
          >
            <el-button icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="更多"
            placement="top-start"
          >
            <el-button icon="el-icon-more"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="取消选择"
            placement="top-start"
          >
            <el-button icon="el-icon-circle-close"></el-button>
          </el-tooltip>
        </div>
      </div>
    </transition>
    <div class="mkdir">
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <el-input
          placeholder="请输入文件夹名"
          v-model="dirParams.dir_name"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="mkdir_btn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <transition name="slide-to-right">
      <div class="upload_file_state" v-loading="loading" v-if="upload_Ele">
        <el-card class="box-card">
          <span>上传进度：</span>
          <div v-for="o in 1" :key="o" class="item">
            <span class="file_name">{{ upload_name }}</span>
            <el-progress
              v-if="!isNaN(percentage)"
              :percentage="percentage"
              style="width: 280px; display: inline-block; margin-left: 10px"
            ></el-progress>
          </div>
          <p>tip：上传过程中不要离开此页面</p>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  uploadFiles,
  mkdir,
  merge,
  getUserUsedDrive,
  getSearch,
} from "../api/file";
import { format } from "../utils/data";
import { getMD5 } from "../utils/cryto";
import Folder from "./Folder.vue";
export default {
  data() {
    return {
      checked: null,
      searchWord: null,
      checkAll: false,
      fileList: [],
      isIndeterminate: true,
      menuShow: false,
      footerMenuShow: false,
      menuEle: null,
      arryCheck: [],
      clickIndex: null,
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      centerDialogVisible: false,
      dirParams: {
        dir_name: "新建文件夹",
        type: "folder",
      },
      chunkSize: 1024 * 1024,
      partList: [],
      total: 0,
      index: 0,
      upload_name: "",
      upload_Ele: false,
      percentage: 0,
      loading: false,
      searchFileItem: [],
    };
  },
  watch: {
    arryCheck: {
      handler(a, b) {
        console.log(a, b);
      },
    },
  },
  components: {
    Folder,
  },
  computed: {
    breadcrumb() {
      return this.$store.state.routers;
    },
  },
  methods: {
    // 上传文件
    async upload(e) {
      let {
        data: [drive_used, drive_size],
      } = await getUserUsedDrive(this.$store.state.userInfo);

      let info = JSON.parse(localStorage.getItem("userInfo"));
      info.drive_used = drive_used;
      info.drive_size = drive_size;
      localStorage.setItem("userInfo", JSON.stringify(info));

      if (drive_used >= drive_size) {
        this.$message.error("当前账户可用空间不足");
        return;
      }
      var file = e.target.files[0];
      this.upload_name = file.name;
      let start = 0;
      while (start <= file.size) {
        start = this.total * this.chunkSize;
        let [f_name, f_ext] = file.name.split(".");
        let blob = file.slice(start, start + this.chunkSize);
        let blob_name = `${f_name}.${this.total}.${f_ext}`;
        let bolo_file = new File([blob], blob_name);

        this.partList.push(bolo_file);
        this.total += 1;

        if (start >= file.size) {
          break;
        }
      }
      this.sendRequest(e);
    },

    // 更新上传进度
    progressPerce(index) {
      let result = parseInt((index / this.total) * 100);
      this.percentage = result == 100 ? 99 : result;
    },

    // 发送上传请求
    async sendRequest(e) {
      this.upload_Ele = true;
      this.index = 0;
      let list = this.partList,
        listLength = list.length;
      for (let i = 0; i < listLength; i++) {
        let formData = new FormData();
        formData.append("file", list.shift());
        await uploadFiles(formData);
        this.index++;
        this.progressPerce(this.index);
      }
      setTimeout(() => {
        this.mergeFile(e);
      }, 4000);
    },

    // 合并文件
    mergeFile(e) {
      var files = e.target.files[0];
      var name = files.name;
      var that = this;
      var file_id = getMD5(name);
      var file_size = files.size;
      var file_type = files.type;
      let time = format("YYYY-MM-DD hh:mm:ss");
      let { drive_id } = this.$store.state.userInfo;
      let parent_file_id = this.$store.state.parent_file_id;
      merge({
        drive_id,
        file_id,
        name,
        parent_file_id,
        file_size,
        file_type,
        created_at: time,
        updated_at: time,
      }).then((res) => {
        that.$refs.folder.getUserFile();
        this.$message({
          type: "success",
          message: res.message + "!",
        });
      });
      this.upload_Ele = false;
      this.total = 0;
      this.index = 0;
      this.percentage = 0;
    },

    // 创建文件夹
    mkdir_btn() {
      let { drive_id } = this.$store.state.userInfo;
      let time = format("YYYY-MM-DD hh:mm:ss");
      let { dir_name, type } = this.dirParams;
      let parent_file_id = this.$store.state.parent_file_id;
      let file_id = getMD5(parent_file_id + dir_name);
      mkdir({
        drive_id,
        parent_file_id,
        file_id,
        filename: dir_name,
        type,
        created_at: time,
        updated_at: time,
      }).then(() => {
        this.$refs.folder.getUserFile();
      });
      this.centerDialogVisible = false;
    },

    // 下载文件
    download_url() {
      let { download_url, name } = this.fileList[this.clickIndex];
      console.log(download_url, name);
      var eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.style.display = "none";
      eleLink.href = download_url;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      console.log(eleLink);
      // 然后移除
      document.body.removeChild(eleLink);
    },

    // 搜索文件
    searchFile() {
      this.$refs.folder.open({
        name: `${this.searchWord}的搜索结果`,
        file_id: "xiezy",
        type: "search",
      });
      let { drive_id } = this.$store.state.userInfo;
      getSearch({ searchWord: this.searchWord, drive_id }).then((res) => {
        this.searchFileItem = res.data;
      });
    },

    // 导航后退
    goBack(item, index) {
      // if(index == 0) index+=1
      this.$store.state.parent_file_id = item.path;
      this.$store.commit("del_router", index);
      this.$refs.folder.getUserFile();
    },
  },
  created() {
    this.$store.commit("setFavorite", "file");
  },
  mounted() {
    this.menuEle = this.$refs.fileMenu;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  },
};
</script>

<style lang="less" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-to-right-enter-active,
.slide-to-right-leave-active {
  transition: all 0.5s ease;
}
.slide-to-right-enter,
.slide-to-right-leave-to {
  opacity: 0;
}

.File {
  .breadcrumb {
    margin: 15px 15px;
  }
  .breadcrumb /deep/ .nav_link {
    cursor: pointer;
  }
  .fileList {
    padding: 15px 0 0 0px;
    margin-left: 10px;
    .fileItem {
      width: 100px;
      padding: 10px;
      text-align: center;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      a {
        display: inline-block;
        text-decoration: none;
      }
      &:hover {
        background-color: #f5f5f6;
        & > .selete,
        .more {
          display: inline-block;
        }
      }
      .img {
        width: 100px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .selete {
        display: none;
        position: absolute;
        left: 1px;
        top: 1px;
        padding: 3px;
        height: 15px;
        width: 15px;
        border-radius: 5px;
        background-color: #fff;
        & /deep/ .el-checkbox__label {
          display: none;
        }
      }
      .more {
        padding: 3px;
        height: 15px;
        width: 15px;
        display: none;
        position: absolute;
        right: 1px;
        top: 1px;
        border-radius: 5px;
        background-color: #fff;
        i {
          color: #aaa;
          line-height: 18px;
          height: 18px;
          display: block;
          &:hover {
            color: #000;
          }
        }
      }
      .title {
        width: 100px;
        p {
          margin: 5px;
          &.name {
            font-weight: 100;
            font-size: 15px;
            font-family: Arial, Helvetica, sans-serif;
          }
          &.time {
            font-size: 12px;
            color: #bbb;
          }
        }
      }
    }
    .el-checkbox {
      position: absolute;
      left: 4px;
      top: 0;
      & /deep/ .el-checkbox__inner {
        border-radius: 50%;
      }
    }
  }
  .fileMenuAction {
    padding: 10px;
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    ul.fileMenu {
      margin: 0;
      padding: 0;
      max-width: 150px;
      position: absolute;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 5px 5px #eee;
      li {
        list-style: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: #c5c5c5;
        }
      }
    }
  }
  .footerMenu {
    padding: 10px;
    width: calc(100% - 250px);
    height: 10vh;
    position: absolute;
    left: 250px;
    bottom: 0;
    .footItem {
      position: absolute;
      bottom: 30px;
      left: 50%;
      padding: 10px 15px;
      border-radius: 10px;
      transform: translateX(-50%);
      background-color: #000;
      button {
        padding: 5px;
        background-color: transparent;
        border: 1px solid transparent;
        &:hover {
          background-color: #545459;
        }
        /deep/ i {
          font-size: 17px;
          color: #ddd;
        }
      }
    }
  }
  .upload_file_state {
    .box-card {
      width: 420px;
      position: absolute;
      right: 10px;
      bottom: 20px;
      .item {
        padding: 10px 0;
        .file_name {
          width: 130px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      p {
        font-size: 13px;
        color: #aaa;
      }
    }
  }
}
.tui-checkbox:checked {
  background: #1673ff;
}
.tui-checkbox {
  width: 15px;
  height: 15px;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  font-size: 0.8rem;
  margin: 0;
  padding: 0;
  position: relative;
  display: inline-block;
  vertical-align: top;
  cursor: default;
  -webkit-appearance: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-transition: background-color ease 0.1s;
  transition: background-color ease 0.1s;
  margin-bottom: 30px;
  &:hover {
    border: #1673ff 1px solid;
  }
}
.tui-checkbox:checked::after {
  content: "";
  top: 2px;
  left: 1px;
  position: absolute;
  background: transparent;
  border: #fff solid 2px;
  border-top: none;
  border-right: none;
  height: 4px;
  width: 8px;
  transform: rotate(-45deg);
}
</style>