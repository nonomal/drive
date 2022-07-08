<template>
  <transition>
    <div class="photo-show">
      <!-- <img v-lazy="imgSrc" @click="imgZoom" :style="cursorStyle" ref="img" /> -->
      <img
        draggable="false"
        v-lazy="imgSrc.src"
        ref="img"
        class="show-big-pic"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mousewheel="mouseWheel"
      />
      <p
        class="imageName"
        :style="{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: fontColor,
        }"
      >
        {{ imgSrc.imageName }}
      </p>
    </div>
  </transition>
</template>
<script>
import catchError from "../../utils/catchError";
import getImageColor from "./utils/getImageMainColor";
import setCenterPosition from "./utils/setCenterPosition";
export default {
  name: "PhotoShow",
  props: {
    imgSrc: Object,
    currentIndex: {
      type: Number,
      default: 0,
    },
    isShow: Boolean,
  },
  data() {
    return {
      zoomObj: {
        zoom: 1,
        zoomIn: true,
        zoomDom: null,
      },
      mouseDownInfo: {
        x: 0,
        y: 0,
      },
      rotate: 0,
      isMove: false,
      fileColor: {},
    };
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        if (newVal == this.$vnode.key) {
          setCenterPosition(this.zoomObj.zoomDom);
          this.rotate = 0;
          this.zoomObj.zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`;
        }
      },
    },
  },
  computed: {
    fontColor() {
      if (!this.fileColor.mainColor) return "";
      return this.fileColor.mainColor;
    },
    oppositionColor() {
      return this.fileColor.oppositionColor;
    },
  },
  methods: {
    zoomB(index) {
      let { key } = this.$vnode;
      if (key !== index) return;
      if (this.zoomObj.zoom > 4) return;
      let { zoomDom } = this.zoomObj;
      this.zoomObj.zoom += 0.2;
      zoomDom &&
        (zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`);
    },
    zoomS(index) {
      let { key } = this.$vnode;
      if (key !== index) return;
      if (this.zoomObj.zoom < 0.3) return;
      let { zoomDom } = this.zoomObj;
      this.zoomObj.zoom -= 0.2;
      zoomDom &&
        (zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`);
    },
    imgRotate(index) {
      let { key } = this.$vnode;
      if (key !== index) return;
      let { zoomDom } = this.zoomObj;
      this.rotate += 90;
      if (this.rotate > 3600) this.rotate = 0;
      zoomDom &&
        (zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`);
    },
    saveImage(index) {
      let { key } = this.$vnode;
      if (key !== index) return;
      let a = document.createElement("a");
      let { imageName, src } = this.imgSrc;
      a.download = imageName || Date.now();
      a.href = src;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    mouseDown(e) {
      this.isMove = true;
      let { offsetX, offsetY } = e;
      this.mouseDownInfo.x = offsetX;
      this.mouseDownInfo.y = offsetY;
    },
    mouseMove(e) {
      if (!this.isMove) return;
      let { clientX, clientY } = e;
      let { x, y } = this.mouseDownInfo;
      let { zoomDom } = this.zoomObj;
      zoomDom.style.transition = "none";
      zoomDom.style.marginLeft = "0px";
      zoomDom.style.marginTop = "0px";
      zoomDom.style.left = clientX - x + "px";
      zoomDom.style.top = clientY - y + "px";
      zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`;
    },
    mouseUp() {
      this.isMove = false;
      this.zoomObj.zoomDom.style.transition = "all 0.3s ease-out";
    },
    mouseWheel(e) {
      let targetDom = e.target.tagName;
      let wheelData = e.wheelDeltaY;
      if (targetDom.toUpperCase() == "IMG" && wheelData) {
        wheelData > 0
          ? this.zoomB(this.currentIndex)
          : this.zoomS(this.currentIndex);
      }
    },
    clearImageStyle(index) {
      let { key } = this.$vnode;
      if (key !== index) return;
      let { zoomDom } = this.zoomObj;
      if (zoomDom) {
        setCenterPosition(zoomDom);
        this.zoomObj.zoom = 1;
        this.zoomObj.zoomIn = true;
      }
    },
    autoScale(index) {
      let { key } = this.$vnode;
      if (key !== index) return;
      let { zoomDom } = this.zoomObj;
      this.zoomObj.zoom = 1;
      this.rotate = 0;
      zoomDom.style.transform = `scale(${this.zoomObj.zoom})`;
      setCenterPosition(zoomDom);
    },
    mountHandle() {
      this.$bus.$on("scaleB", (index) => this.zoomB(index));
      this.$bus.$on("scaleS", (index) => this.zoomS(index));
      this.$bus.$on("imgRotate", (index) => this.imgRotate(index));
      this.$bus.$on("saveImage", (index) => this.saveImage(index));
      this.$bus.$on("autoScale", (index) => this.autoScale(index));
      this.$bus.$on("clearImageStyle", (index) => this.clearImageStyle(index));
      document.addEventListener("mouseup", this.mouseUp, false);
    },
    destoryHandle() {
      this.$bus.$off("scaleB");
      this.$bus.$off("scaleS");
      this.$bus.$off("imgRotate");
      this.$bus.$off("saveImage");
      this.$bus.$off("autoScale");
      this.$bus.$off("clearImageStyle");
      document.removeEventListener("mouseup", this.mouseUp, false);
      document.onmouseup = null;
    },
    async setFileColor() {
      if (this.currentIndex == this.$vnode.key) {
        let [err, color] = await catchError(
          getImageColor(this.imgSrc.src, "opposition", "HEX")
        );
        err
          ? (this.fileColor = { mainColor: "#fff", oppositionColor: "#000" })
          : (this.fileColor = color);
      }
    },
    async mountInvoid() {
      this.zoomObj.zoomDom = this.$refs.img;
      this.mountHandle();
      this.setFileColor();
      if (this.$refs.img) this.$refs.img.onmouseup = this.mouseUp;
    },
  },
  mounted() {
    this.mountInvoid();
  },
  beforeDestroy() {
    this.destoryHandle();
  },
};
</script>
<style lang='less' scoped>
.photo-show {
  width: 100%;
  height: 100%;
  position: absolute;
  user-select: none;
  img {
    width: 600px;
    object-fit: contain;
    position: absolute;
    left: 50%;
    top: 50%;
    display: block;
    cursor: move;
    transition: all 0.3s ease-out;
    margin-left: -300px;
    margin-top: -300px;
  }
  p.imageName {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    color: #aaa;
    padding: 5px 10px;
    line-height: 32px;
    text-align: center;
    border-radius: 10px;
    background-color: #fff;
  }
}
</style>