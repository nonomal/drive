<template>
  <div class="photo-menu">
    <div
      class="menu-item"
      v-for="item in menuData"
      :key="item.id"
      :title="item.title"
      @click="doClick(item.action)"
    >
      <i :class="['iconfont', item.iconFont]"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "PhotoMenu",
  props: {
    menuData: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    imageLength: Number,
  },
  data() {
    return {};
  },
  methods: {
    doClick(action) {
      switch (action) {
        case "scaleB":
          this.$bus.$emit("scaleB", this.currentIndex);
          break;
        case "scaleS":
          this.$bus.$emit("scaleS", this.currentIndex);
          break;
        case "autoScale":
          this.$bus.$emit("autoScale", this.currentIndex);
          break;
        case "next":
          this.switchImage("next");
          break;
        case "prev":
          this.switchImage("prev");
          break;
        case "rotate":
          this.$bus.$emit("imgRotate", this.currentIndex);
          break;
        case "save":
          this.$bus.$emit("saveImage", this.currentIndex);
          break;
        default:
          break;
      }
    },

    changeIndex(index) {
      this.$emit("changeIndex", index);
    },

    switchImage(action) {
      if (this.imageLength == 1) return;
      if (action == "prev") {
        if (this.currentIndex == 0) this.changeIndex(this.imageLength - 1);
        else this.changeIndex(this.currentIndex - 1);
      } else {
        if (this.currentIndex == this.imageLength - 1) this.changeIndex(0);
        else this.changeIndex(this.currentIndex + 1);
      }
      this.$bus.$emit("clearImageStyle", this.currentIndex);
    },
  },
};
</script>
<style lang='less' scoped>
@import url("./assets/font/iconfont.css");
.photo-menu {
  max-height: 50px;
  display: flex;
  margin: 20px 0;
  position: absolute;
  left: 50%;
  bottom: 30px;
  z-index: 333;
  transform: translateX(-50%);
  padding: 8px 10px;
  border-radius: 5px;
  background-color: var(--background-color);
  z-index: 99;
  .menu-item {
    height: 25px;
    width: 25px;
    border-radius: 2px;
    cursor: pointer;
    margin: 0 7px;
    box-sizing: border-box;
    color: var(--font-color);
    font-size: 18px;

    &:hover {
      background-color: var(--background-menu-color);
    }
    i {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 25px;
      text-align: center;
    }
  }
}
</style>