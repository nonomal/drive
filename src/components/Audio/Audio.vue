<template>
  <transition name="slide-fade">
    <div class="audio_play" v-if="audio_play" ref="audio_playEle" v-drag>
      <div class="audio_top">
        <div class="audio_img">
          <img v-lazy="audio_info.DOMAIN + '/' + audio_info.cover_url" alt="" />
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
</template>
<script>
export default {
  name: "Audio",
  data() {
    return {
      audio_play: true,
      audioEle: null,
      sliderEle: null,
      duration: null,
      audioPaused: false,
      currentTimes: "00:00",
    };
  },
  props: {
    audio_info: {
      type: Object,
      required: true,
    },
  },
  methods: {
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
    },

    // 音乐是否加载完毕
    audioEnd() {
      this.audioPaused = true;
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
    this.$nextTick(() => {
      this.audioEle = this.$refs.audio;
      this.sliderEle = this.$refs.slider;
      if (!this.audioEle) return;
      this.audioEle.addEventListener("canplaythrough", this.init_audio_time);
      this.audioEle.addEventListener("end", this.audioEnd);
    });
  },
  beforeDestroy() {
    this.audioEle.removeEventListener("canplaythrough", this.init_audio_time);
    this.audioEle.removeEventListener("end", this.audioEnd);
  },
};
</script>
<style lang="less" scoped>
.audio_play {
  height: 60px;
  width: 220px;
  padding: 10px 5px 5px;
  cursor: move;
  border-radius: 5px;
  position: absolute;
  left: 30%;
  bottom: 30%;
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>