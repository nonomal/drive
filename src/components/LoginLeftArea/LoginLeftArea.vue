<template>
  <div class="LoginLeftArea">
    <img id="canvasImg" src="https://api.dujin.org/bing/1920.php" alt="" />
    <div class="text" v-if="text">
      {{ text }}
    </div>
    <div class="author" v-if="author">-----{{ author }}</div>
  </div>
</template>
<script>
import { getYiYan } from "../../api/index";
export default {
  data() {
    return {
      color: "",
      text: "我来鹅城只干两件事，公平，公平，公平，还是TMD的公平。",
      author: "姜文",
    };
  },
  methods: {
    async init() {
      getYiYan()
        .then((res) => {
          this.text = res.data.content;
          this.author = res.data.author;
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped lang="less">
.LoginLeftArea {
  height: 410px;
  margin-right: 80px;
  color: var(--login-font-color);
  img {
    height: 410px;
    width: 600px;
    opacity: var(--login-img-opacity);
  }
  .text {
    width: 600px;
    text-align: center;
    margin-top: 4px;
    font-size: 14px;
    overflow: hidden;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .author {
    text-align: right;
  }
}
</style>