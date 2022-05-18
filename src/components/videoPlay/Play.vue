<template>
  <div class="video_play" v-show="isOpen" ref="video_play">
    <el-row :gutter="20">
      <el-col :span="6"
        ><i
          class="el-icon-close"
          @click="video_pause"
          style="cursor: pointer"
        ></i
      ></el-col>
      <el-col :span="6" :offset="3" style="text-align: center">
        <span class="video_name">{{ name }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="view" id="vb" v-show="type.includes('video')">
          <video
            id="vd"
            :src="src"
            playsinline
            webkit-playsinline="true"
          ></video>
          <div class="video-status" id="log">
            <i class="controlBar"><span class="dian"></span></i>
            <i class="play iconfont icon-bofang"></i>
            <span class="currentTime"></span>&nbsp;&nbsp;/&nbsp;&nbsp;
            <span class="druation"></span>
            <div class="controlRight">
              <i class="audio iconfont icon-shengyin" title="音量"></i>
              <i class="fullScree iconfont icon-quanping1" title="全屏"></i>
              <i class="set iconfont icon-shezhi" title="设置"></i>
            </div>
          </div>
        </div>
        <div class="images" v-show="type.includes('image')">
          <img :src="src" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      log: null,
      videoBox: null,
      videoDom: null,
      fullScree: null,
      playDom: null,
      controlBarDom: null,
      aArray: null,
      dianDom: null,
      currentTimeDom: null,
      druationDom: null,
      video_play: null,
      src: null,
      name: null,
      type: "",
    };
  },
  computed: {
    ...mapState("file", ["isOpen"]),
    video_info() {
      return this.$store.state.video_info;
    },
  },
  watch: {
    video_info() {
      this.src = this.video_info.download_url;
      this.name = this.video_info.name;
      this.type = this.video_info.type;
    },
    isOpen(val) {
      if (val) {
        this.video_play.style.zIndex = 2;
      } else {
        this.video_play.style.zIndex = -1;
      }
    },
  },
  methods: {
    debouce(func, delay, immediate) {
      var timer = null;
      return function () {
        var context = this;
        var args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
          //根据距离上次触发操作的时间是否到达delay来决定是否要现在执行函数
          var doNow = !timer;
          //每一次都重新设置timer，就是要保证每一次执行的至少delay秒后才可以执行
          timer = setTimeout(function () {
            timer = null;
          }, delay);
          //立即执行
          if (doNow) {
            func.apply(context, args);
          }
        } else {
          timer = setTimeout(function () {
            func.apply(context, args);
          }, delay);
        }
      };
    },
    throttle(func, delay, parms) {
      var prev = Date.now();
      return function () {
        var context = this;
        var now = Date.now();
        if (now - prev >= delay) {
          func.apply(context, Array(parms));
          prev = Date.now();
        }
      };
    },

    fullScreeAutoShowHide(timer) {
      this.log.style.bottom = "40px";
      this.videoBox.style.cursor = "default";
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.log.style.bottom = "-40px";
        this.videoBox.style.cursor = "none";
      }, 3000);
    },

    fullScreeVideo(e) {
      e.stopPropagation();
      let timer;
      if (!this.checkFull()) {
        this.videoBox.requestFullscreen();
        this.videoDom.style.width = "100vw";
        this.videoDom.style.height = "100vh";

        if (this.videoDom.paused) {
          this.videoDomPlay();
        }
        this.videoDom.addEventListener(
          "mousemove",
          this.throttle(this.fullScreeAutoShowHide, 1000, timer)
        );
      } else {
        this.videoDom.style.width = "100%";
        this.videoDom.style.height = "100%";
        document.exitFullscreen(); //要用document调用此函数
      }
    },

    videoDomPlay() {
      if (this.videoDom.paused) {
        this.videoDom.play();
        this.aArray[1].classList.remove("icon-bofang");
        this.aArray[1].classList.add("icon-zanting");
      } else {
        this.videoDom.pause();
        this.aArray[1].classList.remove("icon-zanting");
        this.aArray[1].classList.add("icon-bofang");
      }
    },

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

    checkFull() {
      var isFull =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      if (isFull === undefined) isFull = false;
      return isFull;
    },

    fullScreen(element) {
      element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },

    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },

    video_pause() {
      this.SET_IS_OPEN(false);
      this.videoDom.pause();
    },
    ...mapMutations("file", ["SET_IS_OPEN"]),
  },
  mounted() {
    this.video_play = this.$refs.video_play;
    this.log = document.getElementById("log");
    this.videoBox = document.getElementById("vb");
    this.videoDom = document.querySelector("#vd");
    this.fullScree = document.querySelector(".fullScree");
    this.playDom = document.querySelector(".play");
    this.controlBarDom = document.querySelector(".controlBar");
    this.video_status = document.querySelector(".video-status");
    this.aArray = document.querySelectorAll(".video-status i");
    this.dianDom = document.querySelector(".video-status .controlBar .dian");
    this.currentTimeDom = document.querySelector(".video-status .currentTime");
    this.druationDom = document.querySelector(".video-status .druation");

    this.fullScree.addEventListener("click", this.fullScreeVideo);
    this.playDom.addEventListener("click", this.videoDomPlay);
    this.videoDom.addEventListener("click", this.videoDomPlay);
    this.videoBox.addEventListener("mouseover", () => {
      this.log.style.bottom = "40px";
    });
    this.videoBox.addEventListener("mouseout", () => {
      this.log.style.bottom = "-40px";
    });
    this.aArray[2].addEventListener("click", () => {
      if (this.videoDom.muted) {
        this.videoDom.muted = false; // 打开声音
      } else {
        this.videoDom.muted = true; // 关闭声音
      }
    });
    this.controlBarDom.addEventListener("click", (e) => {
      let controlBarLength = parseInt(
        getComputedStyle(this.controlBarDom)["width"]
      );
      let currentX = e.offsetX;
      this.videoDom.currentTime =
        (currentX / controlBarLength) * this.videoDom.duration;
    });
    this.videoDom.addEventListener("canplaythrough", () => {
      console.log("提示:视频的元数据已加载");
      let duration = this.videoDom.duration;
      let currentTimes = this.videoDom.currentTime;
      this.currentTimeDom.innerText = this.numToMinute(parseInt(currentTimes));
      this.druationDom.innerText = this.numToMinute(parseInt(duration));
    });
    this.videoDom.addEventListener("timeupdate", () => {
      let duration = this.videoDom.duration;
      let currentTimes = this.videoDom.currentTime;
      this.currentTimeDom.innerText = this.numToMinute(parseInt(currentTimes));
      this.druationDom.innerText = this.numToMinute(parseInt(duration));
      let dianDomWidth = Number((currentTimes / duration).toFixed(2));
      this.dianDom.style.width = dianDomWidth * 100 + "%";
    });
    this.videoDom.addEventListener("ended", () => {
      this.aArray[1].classList.remove("icon-zanting");
      this.aArray[1].classList.add("icon-bofang");
    });

    window.document.addEventListener("keydown", (e) => {
      if (e.keyCode == 32) {
        this.videoDomPlay();
      }
    });
  },
};
</script>

<style lang="less" scoped>
.video_play {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 20px;
  z-index: -1;
  background-color: #fff;
  .view {
    width: 1000px;
    height: 560px;
    margin: 50px auto 0;
    position: relative;
    overflow: hidden;
    background-color: #000;
    video {
      width: 1000px;
      height: 100%;
      object-fit: contain;
    }
  }
  .images {
    width: 1000px;
    height: 560px;
    margin: 50px auto 0;
    position: relative;
    overflow: hidden;
    text-align: center;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      object-fit: cover;
    }
  }
  .video-status {
    width: 100%;
    position: absolute;
    bottom: -40px;
    color: #fff;
    transition: all 1s;
  }
  .video-status .controlRight {
    position: absolute;
    display: inline-block;
    right: 40px;
  }
  .video-status i {
    margin-left: 15px;
    display: inline-block;
    cursor: pointer;
    color: #fff;
  }
  .video-status i:nth-child(4) {
    font-size: 22px;
  }
  .video-status .controlRight .audio:hover {
    color: teal;
    animation: fullScreen 0.5s linear;
  }
  .video-status .controlRight .fullScree:hover {
    color: teal;
    animation: fullScreen 0.5s linear;
  }
  .video-status .controlRight .set:hover {
    color: teal;
    animation: set 0.5s linear;
  }
  .video-status i:nth-child(2) {
    font-size: 22px;
  }
  .video-status .controlRight .audio {
    font-size: 21px;
  }
  .video-status .controlRight .fullScree {
    font-size: 21px;
  }
  .video-status .controlRight .set {
    font-size: 25px;
    right: 30px;
  }
  .video-status .controlBar {
    width: 100%;
    height: 4px;
    left: 0;
    display: inline-block;
    background-color: #fff;
    border-radius: 2px;
    position: relative;
    vertical-align: middle;
    margin: 10px 0 10px 0;
  }
  .video-status .controlBar:hover {
    height: 10px;
  }
  .video-status .controlBar:hover .dian {
    height: 100%;
  }
  .video-status .currentTime {
    margin-left: 10px;
  }
  .video-status .currentTime,
  .video-status .druation {
    color: #fff;
    font-size: 18px;
  }
  .video-status .controlBar .dian {
    width: 0px;
    height: 4px;
    top: 0;
    left: 0;
    background-color: teal;
    display: inline-block;
    position: absolute;
  }

  video::-webkit-media-controls {
    display: none !important;
  }
  @keyframes set {
    100% {
      transform: rotateZ(180deg);
    }
  }
  @keyframes fullScreen {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(0.9);
    }
  }

  .full-screen {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
}
</style>