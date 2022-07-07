<template>
  <transition>
    <div class="photo-show">
      <!-- <img v-lazy="imgSrc" @click="imgZoom" :style="cursorStyle" ref="img" /> -->
      <img
        draggable="false"
        v-lazy="imgSrc.src"
        ref="img"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mousewheel="mouseWheel"
      />
      <p
        class="imageName"
        :style="{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: backgroundColor,
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
export default {
  name: "PhotoShow",
  props: {
    imgSrc: Object,
    currentIndex: Number,
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
  computed: {
    backgroundColor() {
      if (!this.fileColor.mainColor) return "";
      return this.fileColor.mainColor;
    },
    oppositionColor() {
      return this.fileColor.oppositionColor;
    },
  },
  methods: {
    zoomB() {
      if (this.zoomObj.zoom > 4) return;
      let { zoomDom } = this.zoomObj;
      this.zoomObj.zoom += 0.2;
      zoomDom &&
        (zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`);
    },
    zoomS() {
      if (this.zoomObj.zoom < 0.3) return;
      let { zoomDom } = this.zoomObj;
      this.zoomObj.zoom -= 0.2;
      zoomDom &&
        (zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`);
    },
    imgRotate() {
      let { zoomDom } = this.zoomObj;
      this.rotate += 90;
      if (this.rotate > 3600) this.rotate = 0;
      zoomDom &&
        (zoomDom.style.transform = `scale(${this.zoomObj.zoom}) rotate(${this.rotate}deg)`);
    },
    imgZoom() {
      if (this.zoomObj.zoomIn) {
        this.zoomB();
      } else this.zoomS();
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
        wheelData > 0 ? this.zoomB() : this.zoomS();
      }
    },
    clearImageStyle() {
      let { zoomDom } = this.zoomObj;
      if (zoomDom) {
        zoomDom.style.transform = `translate(-50%, -50%)`;
        (this.zoomObj.zoom = 1), (this.zoomObj.zoomIn = true);
      }
    },
    autoScale() {
      let { zoomDom } = this.zoomObj;
      this.zoomObj.zoom = 1;
      this.rotate = 0;
      zoomDom.style.transform = `scale(${this.zoomObj.zoom})`;
      this.setCenter(zoomDom);
    },
    mountHandle() {
      this.$bus.$on("scaleB", () => this.zoomB());
      this.$bus.$on("scaleS", () => this.zoomS());
      this.$bus.$on("imgRotate", () => this.imgRotate());
      this.$bus.$on("saveImage", (index) => this.saveImage(index));
      this.$bus.$on("autoScale", () => this.autoScale());
      this.$bus.$on("clearImageStyle", () => this.clearImageStyle());
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
    },
    setCenter(zoomDom) {
      let { width, height } = zoomDom;
      zoomDom.style.marginLeft = -width / 2 + "px";
      zoomDom.style.marginTop = -height / 2 + "px";
      zoomDom.style.left = "50%";
      zoomDom.style.top = "50%";
    },
    autoCenterArea(zoomDom) {
      let _this = this;
      zoomDom.onload = function () {
        _this.setCenter(zoomDom);
      };
    },
  },
  async mounted() {
    this.zoomObj.zoomDom = this.$refs.img;
    this.mountHandle();
    this.autoCenterArea(this.zoomObj.zoomDom);
    if (this.$refs.img) this.$refs.img.onmouseup = this.mouseUp;
    let [err, color] = await catchError(
      getImageColor(this.imgSrc.src, "opposition", "HEX")
    );
    if (err) this.fileColor = { mainColor: "#fff", oppositionColor: "#000" };
    else this.fileColor = color;
  },
  beforeDestroy() {
    this.destoryHandle();
    document.onmouseup = null;
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
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>