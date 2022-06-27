<template>
  <div class="video_play" v-show="isOpen">
    <el-row :gutter="20">
      <el-col :span="6"
        ><i
          class="el-icon-close"
          @click="video_pause"
          style="cursor: pointer"
        ></i
      ></el-col>
      <el-col :span="6" :offset="3" style="text-align: center">
        <span class="video_name">{{ video_name }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div
          class="dplayer"
          v-show="file_type.includes('video')"
          style="width: 100%; height: 520px; position: relative"
        ></div>
        <!-- <div class="view" id="vb" v-show="file_type.includes('video')">
          <NPlayer ref="player" :options="options" :set="setPlayer" />
        </div> -->
        <div class="images" v-if="file_type.includes('image')">
          <img :src="image_src" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import DPlayer from "dplayer";

export default {
  data() {
    return {
      file_type: "",
      video_name: "",
      image_src: "",
      // options: {
      //   src: "",
      //   poster: "",
      // },
      dp: null,
    };
  },
  computed: {
    ...mapState("file", ["isOpen", "video_info"]),
  },
  watch: {
    video_info() {
      let { download_url, DOMAIN, file_name, type, cover_url } =
        this.video_info;
      // this.options.src = DOMAIN + "/" + download_url;
      // this.image_src = DOMAIN + "/" + download_url;
      // this.video_name = file_name;
      // this.file_type = type;
      // this.options.poster = DOMAIN + "/" + cover_url;
      // this.$options.player.updateOptions(this.options);
      this.video_name = file_name;
      this.file_type = type;
      if (!this.dp) this.initDplay();
      this.dp = this.dp.switchVideo({
        url: DOMAIN + "/" + download_url,
        pic: DOMAIN + "/" + cover_url,
      });
      console.log(this.dp);
      this.setNavigatorData(this.video_info);
    },
  },
  methods: {
    video_pause() {
      this.SET_IS_OPEN(false);
      // this.$options.player.pause();
      console.log(this.dp);
      this.dp && this.dp.pause();
    },
    initDplay() {
      this.container = document.querySelector(".dplayer");
      if (!this.container) return;
      this.dp = new DPlayer({
        theme: "#00A1D6",
        loop: true,
        lang: "zh-cn",
        airplay: true,
        screenshot: true,
        hotkey: true,
        preload: "auto",
        volume: 0.7,
        mutex: true,
        video: {
          url: "demo.mp4",
          pic: "",
        },
        container: this.container,
      });
      console.log(this.dp);
    },
    // setPlayer(player) {
    //   this.$options.player = player;
    // },
    setNavigatorData({ DOMAIN, cover_url }) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: "",
        artwork: [
          {
            sizes: "320x180",
            src: DOMAIN + "/" + cover_url,
            type: "",
          },
        ],
      });
    },
    ...mapMutations("file", ["SET_IS_OPEN", "SET_VIDEO_INFO"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.initDplay();
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
  z-index: 2;
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