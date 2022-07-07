<template>
  <div class="File">
    <el-row :gutter="20" style="margin: 20px 0 20px">
      <el-col :span="12">
        <div
          :class="styleClass + ' icon-btn'"
          @click="SET_ISCOLLAPSE(!isCollapse)"
        ></div>
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
        <el-breadcrumb-item v-for="(item, index) in routers" :key="index">
          <span class="nav_link" @click="goBack(item, index)">{{
            item.file_name
          }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="fileList">
      <Folder ref="folder" :searchFileItem="searchFileItem"></Folder>
    </div>
    <div class="file-page">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageLimit"
        :page-count="totalPage"
        :current-page="currentPage"
        @prev-click="prevClick"
        @next-click="nextClick"
        @current-change="nextClick"
      />
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
import { mkdir, getSearch } from "../api/file";
import { format } from "../utils/data";
import { getMD5 } from "../utils/cryto";
import Folder from "./Folder.vue";
import { mapMutations, mapState } from "vuex";
import uploadFileMixin from "./mixins/file";
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
      clickIndex: null,
      centerDialogVisible: false,
      dirParams: {
        dir_name: "新建文件夹",
        type: "folder",
      },

      searchFileItem: [],
    };
  },
  components: {
    Folder,
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("file", [
      "routers",
      "parent_file_id",
      "fileTotal",
      "currentPage",
      "totalPage",
      "pageLimit",
      "parent_folder",
    ]),
    ...mapState("sideBar", ["isCollapse", "styleClass"]),
  },
  mixins: [uploadFileMixin],
  methods: {
    // 创建文件夹
    mkdir_btn() {
      let { drive_id } = this.userInfo;
      let time = format("YYYY-MM-DD hh:mm:ss");
      let { dir_name, type } = this.dirParams;
      let parent_file_id = this.parent_file_id;
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
      this.SET_ROUTER({
        file_name: `${this.searchWord}的搜索结果`,
        path: Date.now(),
      });
      getSearch({
        searchWord: this.searchWord,
        drive_id: this.userInfo.drive_id,
      }).then((res) => {
        this.searchWord = "";
        this.searchFileItem = res.data;
      });
    },

    // 导航后退
    goBack(item, index) {
      this.SET_PARENT_FILE_ID({ parent_file_id: item.path });
      this.REMOVE_ROUTER(index + 1);
      this.$refs.folder.getUserFile();
    },
    prevClick(page) {
      this.SET_CURRENT_PAGE(page);
      this.$refs.folder.getUserFile();
    },
    nextClick(page) {
      this.SET_CURRENT_PAGE(page);
      this.$refs.folder.getUserFile();
    },

    ...mapMutations("file", [
      "REMOVE_ROUTER",
      "SET_PARENT_FILE_ID",
      "SET_FAVORITE",
      "SET_ROUTER",
      "SET_CURRENT_PAGE",
    ]),
    ...mapMutations("sideBar", ["SET_ISCOLLAPSE"]),
  },
  created() {
    this.SET_FAVORITE("file");
  },
  mounted() {
    this.menuEle = this.$refs.fileMenu;
    // this.$alert(
    //   "<p>感谢诸位的支持与理解，祝大家生活愉快。</p><br/><p>感谢诸位的支持与理解，祝大家生活愉快。</p>",
    //   "消息提醒",
    //   {
    //     dangerouslyUseHTMLString: true,
    //   }
    // );
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
  height: calc(100vh - 60px);
  .breadcrumb {
    margin: 15px 15px;
  }
  .breadcrumb /deep/ .nav_link {
    cursor: pointer;
  }
  div.icon-btn {
    font-size: 25px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    vertical-align: middle;
  }
  .fileList {
    padding: 15px 0 0 0px;
    margin-left: 10px;
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
    border-radius: 5px;
    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar {
      width: 10px;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: #409eff;
    }
  }
  .file-page {
    padding-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
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