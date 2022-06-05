<template>
  <div class="LoginLeftArea">
    <img id="canvasImg" src="https://api.dujin.org/bing/1920.php" alt="" />
    <div class="text">
      {{ text }}
    </div>
    <div class="author">-----{{ author }}</div>
  </div>
</template>
<script>
import { getYiYan } from "../../api/index";
export default {
  data() {
    return {
      color: "",
      text: "",
      author: "",
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
</style>