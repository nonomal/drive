<template>
  <div class="LoginLeftArea">
    <img id="canvasImg" src="https://api.dujin.org/bing/1920.php" alt="" />
    <!-- <div v-text="text" class="text"></div> -->
    <div class="text" v-text="text"></div>
  </div>
</template>
<script>
import { getYiYan } from "../../api/index";
export default {
  data() {
    return {
      color: "",
      text: "",
    };
  },
  methods: {
    async init() {
      getYiYan()
        .then((data) => {
          this.text = data.newslist[0].content;
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
.LoginLeftArea {
  height: 410px;
  margin-right: 80px;
}
.LoginLeftArea img {
  height: 410px;
  width: 600px;
}
.text {
  width: 600px;
  height: 40px;
  text-align: center;
  margin-top: 4px;
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}
</style>