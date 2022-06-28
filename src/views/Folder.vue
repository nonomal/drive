<template>
  <div class="folder" ref="folder">
    <div class="boundary" v-if="fileList.length">
      <el-row :gutter="20" v-for="(ele, key) in fileList" :key="key">
        <el-col :span="3" v-for="(item, index) in ele" :key="index">
          <div
            class="fileItem"
            ref="fileItem"
            @contextmenu="handelMenu(index, key, $event)"
            @click="open(item, $event)"
          >
            <div class="selete" @click.stop="add_seleted(item, index, key)">
              <el-checkbox
                v-model="arryCheck"
                :value="index"
                @change="handel"
              ></el-checkbox>
            </div>
            <div class="more" @click.stop="handelMenu(index, key, $event)">
              <i class="el-icon-more"></i>
            </div>
            <div class="img">
              <FileType :item="item" />
            </div>
            <div class="title">
              <p class="name">{{ item.file_name }}</p>
              <p class="time">{{ format("MM/DD hh:mm", item.updated_at) }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="empty" v-else>
      <el-empty>
        <input
          type="file"
          ref="fileEle"
          @change="upload"
          style="display: none"
        />
        <el-button type="primary" @click="$refs.fileEle.click()"
          >上传文件</el-button
        >
      </el-empty>
    </div>

    <transition name="slide-fade">
      <div
        class="fileMenuAction"
        v-show="menuShow"
        @click="menuShow = !menuShow"
      >
        <ul class="fileMenu" ref="fileMenu">
          <li @click="download_url" v-if="!isFolder">下载</li>
          <li @click="getDownload_url" v-if="!isFolder">获取文件直链</li>
          <li @click="collection">{{ collectionText }}</li>
          <li @click="modify_name">重命名</li>
          <li @click="dialogMove = true">移动</li>
          <li @click="detailInfo">查看详细信息</li>
          <li @click="delFile" style="color: red">删除文件</li>
        </ul>
      </div>
    </transition>

    <transition name="slide-fade">
      <el-dialog title="提示" :visible.sync="dialogRename" width="30%" center>
        <el-input placeholder="重命名" v-model="reName"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRename = false">取 消</el-button>
          <el-button type="primary" @click="re_name">确 定</el-button>
        </span>
      </el-dialog>
    </transition>

    <transition name="slide-fade">
      <div class="audio_play" v-show="audio_play" ref="audio_playEle" v-drag>
        <div class="audio_top">
          <div class="audio_img">
            <img
              v-lazy="audio_info.DOMAIN + '/' + audio_info.cover_url"
              alt=""
            />
            <span class="icon_box" @click="play" v-if="audioPaused">
              <svg
                t="1629460803482"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2418"
                width="20"
                height="20"
              >
                <path
                  d="M128 106.858667C128 94.976 137.621333 85.333333 149.12 85.333333h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333H149.12A21.290667 21.290667 0 0 1 128 917.141333V106.88z m640 0c0-11.882667 9.621333-21.525333 21.12-21.525334h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333h-85.76a21.290667 21.290667 0 0 1-21.12-21.525333V106.88z"
                  fill="#ffffff"
                  p-id="2419"
                ></path>
              </svg>
            </span>
            <span class="play" @click.stop="play" v-else>
              <svg viewBox="0 0 1024 1024">
                <use xlink:href="#PDSArrowRightTriangle">
                  <svg id="PDSArrowRightTriangle" viewBox="0 0 1024 1024">
                    <path
                      d="M689.066667 480l-196.266667-177.066667c-27.733333-25.6-70.4-6.4-70.4 32v356.266667c0 36.266667 44.8 55.466667 70.4 32l196.266667-177.066667c17.066667-19.2 17.066667-49.066667 0-66.133333z"
                    ></path>
                  </svg>
                </use>
              </svg>
            </span>
          </div>
          <div class="audio_name">{{ audio_info.file_name }}</div>
          <span @click="close">
            <i class="el-icon-close"></i>
          </span>
          <div class="current_time">{{ currentTimes }} / {{ duration }}</div>
        </div>
        <audio
          :src="audio_info.DOMAIN + '/' + audio_info.download_url"
          hidden
          ref="audio"
          @timeupdate="update_time"
        ></audio>
        <div class="control">
          <div class="slide_rail" @click="changeProgress"></div>
          <div class="slider" ref="slider"></div>
        </div>
      </div>
    </transition>

    <transition name="slide-fade">
      <div class="fileDetailInfo">
        <el-dialog
          :title="fileInfo.file_name"
          :visible.sync="dialogFileInfo"
          width="300px"
          :before-close="detail_info_close"
        >
          <div class="img">
            <FileType :item="fileInfo"></FileType>
          </div>
          <div class="detailText">
            <div class="h5">详细信息</div>
            <ul>
              <li>
                <p>
                  <i class="el-icon-info"></i>{{ fileInfo.file_name
                  }}<span class="file_size" :title="fileInfo.file_size + 'kb'"
                    >{{ fileInfo.file_size | KbToMb }} M</span
                  >
                </p>
              </li>
              <li>
                <p><i class="el-icon-receiving"></i>文件位置</p>
                <span>root</span>
              </li>
              <li>
                <p><i class="el-icon-date"></i>创建时间</p>
                <span>{{
                  format("YYYY-MM-DD hh:mm:ss", fileInfo.created_at)
                }}</span>
              </li>
              <li>
                <p><i class="el-icon-time"></i>修改时间</p>
                <span>{{
                  format("YYYY-MM-DD hh:mm:ss", fileInfo.updated_at)
                }}</span>
              </li>
            </ul>
          </div>
        </el-dialog>
      </div>
    </transition>

    <div class="file_move" v-if="dialogMove">
      <el-dialog title="提示" :visible.sync="dialogMove" width="30%">
        <el-tree
          :props="{ label: 'file_name' }"
          :load="loadNode"
          lazy
          @node-click="nodeClick"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMove = false">取 消</el-button>
          <el-button type="primary" @click="move_action" :disabled="disabled"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getFile,
  delFile,
  modify,
  move,
  getFolder,
  setCollection,
  getCollection,
  getPhoto,
  downloadFile,
} from "../api/file";
import download_file from "../utils/download";
import { format } from "../utils/data";
import FileType from "./File_type.vue";
import uploadFileMixin from "./mixins/file";
import { mapActions, mapMutations, mapState } from "vuex";
import { copy } from "../utils/clipboard";
export default {
  data() {
    return {
      dialogMove: false,
      List: [],
      format,
      fileList: [],
      arryCheck: [],
      menuShow: false,
      menuEle: null,
      clickIndex: null,
      clickKey: null,
      clickOrIndex: null,
      isFolder: false,
      collectionText: "收藏",
      reName: null,
      audio_play: false,
      audio_info: {},
      audioEle: null,
      sliderEle: null,
      duration: null,
      audioPaused: false,
      currentTimes: "00:00",
      dialogRename: false,
      dialogFileInfo: false,
      fileInfo: {},
      col_num: 8,
      DOMAIN: "",
      currentFileId: null,
      mouse_Info: { clientX: null, clientY: null },
      disabled: true,
      fullscreenLoading: false,
      contextmenu: {
        width: 124,
        height: 280,
      },
    };
  },
  mixins: [uploadFileMixin],
  filters: {
    KbToMb(val) {
      return parseInt((val / 1024 / 1024) * 100) / 100;
    },
  },
  components: {
    FileType,
  },
  props: {
    searchFileItem: [],
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapState("file", [
      "parent_file_id",
      "favorite",
      "currentPage",
      "pageLimit",
    ]),
  },
  watch: {
    searchFileItem() {
      this.formatFileData(this.searchFileItem);
    },
    userInfo() {
      this.updateFileList();
    },
  },
  directives: {
    drag(el) {
      el.onmousedown = function (e) {
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + "px";
          el.style.top = e.pageY - disy + "px";
          let clientWidth = window.innerWidth - 230;
          let clientHeight = window.innerHeight - 75;
          let minLeft = 250;
          if (parseInt(el.style.left) >= clientWidth)
            el.style.left = clientWidth + "px";
          if (parseInt(el.style.top) >= clientHeight)
            el.style.top = clientHeight + "px";
          if (parseInt(el.style.left) <= minLeft)
            el.style.left = minLeft + "px";
          if (parseInt(el.style.top) <= 0) el.style.top = 0 + "px";
        };
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },
  },
  methods: {
    ...mapMutations("file", [
      "SET_VIDEO_INFO",
      "SET_PARENT_FILE_ID",
      "SET_IS_OPEN",
      "SET_ROUTER",
      "SET_FILE_TOTAL",
    ]),
    ...mapActions("user", ["getUserDrive"]),
    // tree组件加载事件
    loadNode(node, resolve) {
      let file_id = "root";
      if (node.level === 0) {
        return resolve([
          { file_name: "root", parent_file_id: "root", file_id: "root" },
        ]);
      } else if (node.level > 1) {
        file_id = node.data.file_id;
      }
      getFolder({
        drive_id: this.userInfo.drive_id,
        parent_file_id: file_id,
      }).then((data) => {
        return resolve(data.data);
      });
    },

    openFullScreen1() {},

    // 获取tree组件点击data
    nodeClick(data) {
      let { file_id } = data;
      let { parent_file_id, file_id: currentFile_id } =
        this.List[this.clickIndex];
      this.currentFileId = file_id;
      if (parent_file_id == "root" && file_id == "root") {
        this.disabled = true;
      } else if (file_id == currentFile_id) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },

    // 设置收藏
    async collection() {
      let { file_id, isCollection } = this.List[this.clickIndex];
      if (isCollection) isCollection = 0;
      else isCollection = 1;
      let { status, message } = await setCollection({
        drive_id: this.userInfo.drive_id,
        file_id,
        isCollection,
      });
      if (status == 200) {
        this.List[this.clickIndex].isCollection = isCollection;
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },
    updateFileList() {
      if (this.favorite == "file") {
        this.getUserFile();
      } else if (this.favorite == "favorite") {
        this.getFavorite();
      } else if (this.favorite == "album") {
        this.getPhotos();
      }
    },

    // 格式化文件数据
    formatFileData(data = []) {
      let listItem = [];
      let count = null;
      let aryLength = data.length;
      data.forEach((item) => {
        item.DOMAIN = this.DOMAIN;
      });
      if (aryLength % 8 == 0) {
        count = aryLength / 8;
      } else {
        count = parseInt(aryLength / 8) + 1;
      }
      for (let i = 0; i < count; i++) {
        listItem.push(data.slice(i * 8, (i + 1) * 8));
      }
      this.fileList = listItem;
    },

    // 点击复制
    copy() {},
    // 获取用户文件
    getUserFile(
      drive_id = this.userInfo.drive_id,
      parent_file_id = this.parent_file_id
    ) {
      getFile({
        drive_id,
        limit: this.pageLimit,
        page: this.currentPage,
        parent_file_id,
      })
        .then((res) => {
          let { fileList, DOMAIN } = res;
          this.List = fileList;
          this.DOMAIN = DOMAIN;
          this.SET_FILE_TOTAL(fileList && res.fileList.length);
          this.formatFileData(fileList);
        })
        .catch((err) => {
          console.debug(err);
        });
    },

    // 获取收藏文件
    getFavorite() {
      getCollection({ drive_id: this.userInfo.drive_id }).then((res) => {
        this.List = res.data;
        this.formatFileData(res.data);
      });
    },

    // 获取用户图片
    getPhotos() {
      getPhoto({ drive_id: this.userInfo.drive_id }).then((res) => {
        this.List = res.data;
        this.DOMAIN = res.DOMAIN;
        this.formatFileData(res.data);
      });
    },
    // 鼠标右键菜单
    handelMenu(index, key, e) {
      e.preventDefault();
      this.clickIndex = this.col_num * key + index;
      this.clickKey = key;
      this.clickOrIndex = index;
      let { file_name, type, isCollection } = this.List[this.clickIndex];
      this.mkdirName = file_name;
      if (type == "folder") this.isFolder = true;
      else this.isFolder = false;
      if (isCollection == "0") this.collectionText = "收藏";
      else this.collectionText = "取消收藏";

      this.menuShow = !this.menuShow; //展示或隐藏右键菜单
      this.setContextmenu(e);
    },
    handel() {},

    //设置右键菜单位置
    setContextmenu(e) {
      let { height, width } = this.contextmenu;
      let menuLeft = e.clientX,
        menuTop = e.clientY;
      let clientHeight =
          window.innerHeight || document.documentElement.clientHeight,
        clientWidth = window.innerWidth || document.documentElement.clientWidth;
      // let { height, width } = this.menuEle.getBoundingClientRect();

      if (clientHeight - menuTop < height) menuTop -= height;
      if (clientWidth - menuLeft < width) menuLeft -= width;

      this.menuEle.style.left = menuLeft + "px";
      this.menuEle.style.top = menuTop + "px";
    },

    // 删除文件
    delFile() {
      var that = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delFile({
            file_id: this.List[this.clickIndex].file_id,
            drive_id: this.userInfo.drive_id,
          })
            .then(async (res) => {
              that.fileList[this.clickKey].splice(
                that.clickOrIndex,
                that.clickOrIndex + 1
              );
              this.$message.success(res.message);
              await this.getUserDrive();
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {});
    },

    // 点击事件
    open(item) {
      let { type, file_id, file_name } = item;
      if (type == "folder") {
        this.getUserFile(this.userInfo.drive_id, file_id);
        this.SET_PARENT_FILE_ID(file_id);
        this.SET_ROUTER({ file_name, path: file_id });
      } else if (type.includes("video") || type.includes("image")) {
        this.SET_VIDEO_INFO(item);
        this.SET_IS_OPEN(true);
        this.$videPlayer.show(item);
      } else if (type.includes("audio")) {
        this.audio_play = true;
        this.audio_info = item;
      } else if (type.includes("search")) {
        this.SET_PARENT_FILE_ID(file_id);
        this.SET_ROUTER({ file_name, path: file_id });
      }
    },

    // 下载
    download_url() {
      let { file_id, file_name } = this.List[this.clickIndex];
      downloadFile(file_id, this.userInfo.drive_id)
        .then((res) => {
          let { status, message, download_url } = res;
          if (status == 200) download_file(download_url, file_name);
          else this.$message.error(message);
        })
        .catch(() => {});
    },

    // 获取文件链接
    async getDownload_url() {
      let { DOMAIN, download_url } = this.List[this.clickIndex];
      let realDownload_url = DOMAIN + "/" + download_url;
      copy.call(this, realDownload_url);
    },

    // 重命名
    modify_name() {
      this.dialogRename = true;
      let filename = this.List[this.clickIndex].file_name;
      this.reName = filename.slice(0, filename.lastIndexOf("."));
    },

    // 重命名
    async re_name() {
      let { drive_id } = this.userInfo;
      let { file_id, type } = this.List[this.clickIndex];
      let { status, message } = await modify({
        drive_id,
        file_id,
        filename: this.reName,
        type,
        updated_at: format("YYYY-MM-DD hh:mm:ss"),
      });
      if (status == 200) {
        this.$message.success(message);
        this.getUserFile();
      } else {
        this.$message.error(message);
      }
      this.dialogRename = false;
    },

    // 移动文件
    move_action() {
      move({
        drive_id: this.userInfo.drive_id,
        parent_file_id: this.currentFileId,
        updated_at: format("YYYY-MM-DD hh:mm:ss"),
        file_id: this.List[this.clickIndex].file_id,
      })
        .then((res) => {
          this.$message.success(res.message);
          this.getUserFile();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
      this.dialogMove = false;
      this.disabled = true;
    },

    // 关闭事件
    detail_info_close() {
      this.dialogFileInfo = !this.dialogFileInfo;
    },

    // 查看文件详情
    detailInfo() {
      this.dialogFileInfo = !this.dialogFileInfo;
      this.fileInfo = this.List[this.clickIndex];
    },

    // 添加选中样式
    add_seleted(item, index) {
      let fileItem = this.$refs.fileItem;
      fileItem[index].classList.add("active");
    },

    // 音乐时间格式化
    numToMinute(num) {
      num = Number(num);
      let minute = parseInt(num / 60);
      let second = parseInt(num - minute * 60);
      if (second <= 9) {
        second = "0" + second;
      }
      if (minute <= 9) {
        minute = "0" + minute;
      }
      if (num > 60 * 60) {
        let hours = parseInt((num / 60) * 60);
        return `${hours}:${minute}:${second}`;
      }
      return `${minute}:${second}`;
    },

    // 播放
    play() {
      if (this.audioEle.paused) {
        this.audioEle.play();
        this.audioPaused = !this.audioPaused;
      } else {
        this.audioEle.pause();
        this.audioPaused = !this.audioPaused;
      }
    },

    // 关闭
    close() {
      this.audio_play = false;
      this.audioEle.pause();
      this.audioPaused = true;
      this.sliderEle.style.left = 0;
    },

    // 音乐是否加载完毕
    audioEnd() {
      this.audioPaused = !this.audioPaused;
    },

    // 音乐进度条
    changeProgress(e) {
      var disx = e.offsetX - 5;
      var totalLength = 210;
      let { duration } = this.audioEle;
      var currentSecond = parseInt((disx / totalLength) * duration);
      this.sliderEle.style.left = disx + "px";
      this.audioEle.currentTimes = this.numToMinute(currentSecond);
      this.audioEle.currentTime = currentSecond;
    },

    // 音乐进度条时间更改
    update_time() {
      this.init_audio_time();
    },

    // 初始化音乐进度条时间
    init_audio_time() {
      var totalLength = 210;
      let { currentTime, duration } = this.audioEle;
      this.sliderEle.style.left =
        parseInt((currentTime / duration) * totalLength) + "px";
      this.currentTimes = this.numToMinute(parseInt(currentTime));
      this.duration = this.numToMinute(parseInt(duration));
    },
  },
  mounted() {
    this.menuEle = this.$refs.fileMenu;
    this.audioEle = this.$refs.audio;
    this.sliderEle = this.$refs.slider;
    this.audioEle.addEventListener("canplaythrough", this.init_audio_time);
    this.audioEle.addEventListener("end", this.audioEnd);
    this.updateFileList();
  },
  destroyed() {
    this.audioEle.removeEventListener("canplaythrough", this.init_audio_time);
    this.audioEle.removeEventListener("end", this.audioEnd);
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

.active {
  background-color: #f5f5f6;
  & > .selete,
  .more {
    display: inline-block;
  }
}
.folder {
  padding: 10px;
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
        margin: 5px 0px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.name {
          font-weight: 100;
          font-size: 13px;
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
  .fileMenuAction {
    padding: 10px;
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    ul.fileMenu {
      margin: 0;
      padding: 0;
      max-width: 150px;
      position: absolute;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 0 5px 5px #eee;
      li {
        list-style: none;
        padding: 10px 20px;
        border-radius: 2px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: #c5c5c5;
        }
      }
    }
  }
  .audio_play {
    height: 60px;
    width: 220px;
    padding: 10px 5px 5px;
    cursor: move;
    border-radius: 5px;
    position: absolute;
    box-shadow: 0px 0px 8px #aaa;
    background-color: #fff;
    .audio_top {
      display: flex;
      user-select: none;
      .audio_img {
        width: 50px;
        height: 50px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        span.icon_box {
          cursor: pointer;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: #aaa;
          padding: 2px;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          .icon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        span.play {
          z-index: 1;
          cursor: pointer;
          position: absolute;
          left: 50%;
          top: 50%;
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(162, 162, 166, 0.9);
          transform: translate(-50%, -50%);
          svg {
            width: 30px;
            height: 30px;
            color: #fff;
            fill: currentColor;
            overflow: hidden;
          }
        }
      }
      i {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
      }
      .audio_name {
        width: 130px;
        padding-left: 10px;
        font-size: 13px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .current_time {
        font-size: 12px;
        position: absolute;
        bottom: 10px;
        right: 5px;
      }
    }
    .control {
      margin-top: 5px;
      position: relative;
      cursor: pointer;
      .slide_rail {
        width: 100%;
        height: 4px;
        background-color: #e3e7ed;
      }
      .slider {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        top: -5px;
        left: 0;
        border: 3px solid #e3e7ed;
        background-color: #fff;
      }
    }
  }
  .fileDetailInfo {
    width: 300px;
    position: relative;
    & /deep/ .el-dialog__title {
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 210px;
      display: inline-block;
      overflow: hidden;
    }
    & /deep/ .img {
      margin: 0 auto;
      text-align: center;
      width: 100px;
      height: 100px;
    }
    ul {
      margin: 0;
      padding: 10px 0 0 0;
      li {
        list-style: none;
        padding: 3px;
        p {
          margin: 5px;
          padding: 0;
          i {
            margin-right: 10px;
          }
          span.file_size {
            cursor: pointer;
          }
        }
        span {
          padding-left: 30px;
        }
      }
    }
  }
  .file_move {
    width: 300px;
    position: absolute;
  }
}
</style>