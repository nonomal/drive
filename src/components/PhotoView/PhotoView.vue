<template>
  <transition>
    <div class="photo-view" v-if="isShow">
      <div class="close-btn" @click="setShow(false)">X</div>
      <photo-menu
        :menuData="menuData"
        @changeIndex="currentIndex = $event"
        :currentIndex="currentIndex"
        :imageLength="imageLength"
      ></photo-menu>
      <div class="photo-inner">
        <template v-for="(item, index) in imageData">
          <photo-show
            :imgSrc="item"
            :currentIndex="currentIndex"
            v-show="index == currentIndex"
            :key="index"
          ></photo-show>
        </template>
      </div>
    </div>
  </transition>
</template>
<script>
import PhotoMenu from "./PhotoMenu.vue";
import menuData from "./MenuData";
import PhotoShow from "./PhotoShow.vue";
export default {
  name: "PhotoView",
  props: {
    imageData: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      menuData,
      isShow: false,
    };
  },
  computed: {
    imgSrc() {
      return this.imageData[this.currentIndex];
    },
    imageLength() {
      return this.imageData ? this.imageData.length : 0;
    },
  },
  methods: {
    setShow(state) {
      this.isShow = state;
      if (state) return;
      setTimeout(() => {
        this.$destroy();
        this.$el.remove();
      }, 300);
    },
  },
  components: {
    PhotoMenu,
    PhotoShow,
  },
};
</script>
<style lang='less' scoped>
.photo-view {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  --font-color: #000;
  --file-name-color: #fff;
  --img-brightness: 100%;
  --background-color: #fff;
  --background-menu-color: rgba(0, 0, 0, 0.5);
  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px 0 5px 50%;
    z-index: 444;
    cursor: pointer;
    user-select: none;
    color: var(--font-color);
    background-color: var(--background-color);
  }
  .photo-inner {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-leave-to {
  transform: scale(1.1);
}
.v-enter-to,
.v-leave {
  opacity: 1;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-in-out;
}
@media (prefers-color-scheme: dark) {
  .photo-view {
    --font-color: #aaa;
    --img-brightness: 50%;
    --background-color: #000;
    --file-name-color: #aaa;
    --background-menu-color: rgba(255, 255, 255, 0.5);
  }
}
</style>