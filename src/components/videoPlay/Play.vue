<template>
  <div class="video_play">
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
        <div class="dplayer" v-show="file_type.includes('video')"></div>
        <div class="images" v-if="file_type.includes('image')">
          <img :src="image_src" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DPlayer from "dplayer";
export default {
  data() {
    return {
      file_type: "",
      video_name: "",
      image_src: "",
      dp: null,
    };
  },
  props: {
    video_info: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    video_pause() {
      this.$videPlayer.hide();
    },
    initDplay() {
      this.container = document.querySelector(".dplayer");
      if (!this.container || this.dp || !this.video_info) return;
      let { download_url, DOMAIN, file_name, type, cover_url } =
        this.video_info;
      let options = {
        theme: "#00A1D6",
        loop: true,
        lang: "zh-cn",
        airplay: true,
        screenshot: true,
        hotkey: true,
        preload: "auto",
        volume: 0.7,
        mutex: true,
        logo: require("../../assets/logo1.gif"),
        video: {
          url: DOMAIN + "/" + download_url,
          pic: DOMAIN + "/" + cover_url,
        },
        danmaku: {
          id: "svdgdfb2e43",
          api: "https://api.bilibili.com/x/v1/dm/list.so",
        },
        container: this.container,
      };
      this.video_name = file_name;
      this.file_type = type;
      this.dp = new DPlayer(options);
      this.setNavigatorData(this.video_info);
    },
    setNavigatorData({ DOMAIN, cover_url }) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: this.video_name,
        artwork: [
          {
            sizes: "320x180",
            src: DOMAIN + "/" + cover_url,
            type: "",
          },
        ],
      });
    },
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
  .dplayer {
    max-width: 1000px;
    height: 520px;
    position: relative;
    margin: 0 auto;
    top: 40px;
    & /deep/ .dplayer-logo {
      max-width: 100px;
      max-height: 100px;
    }
  }
}
</style>