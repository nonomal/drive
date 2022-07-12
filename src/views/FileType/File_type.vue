<template>
  <div class="files">
    <div class="img" v-if="type.includes('image')">
      <img v-lazy="cover_url" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="video" v-else-if="type.includes('video')">
      <span class="play">
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
      <img v-lazy="cover_url" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="audio" v-else-if="type.includes('audio')">
      <img :src="require('@/assets/mp3.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="folder_img" v-else-if="type.includes('folder')">
      <img :src="require('@/assets/folder.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="text" v-else-if="type.includes('text')">
      <img :src="require('@/assets/txt.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="zip" v-else-if="isZip">
      <!-- {{ zip.test(type) }} -->
      <img :src="require('@/assets/zip.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="exe" v-else-if="isExe">
      <img :src="require('@/assets/exe.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="pdf" v-else-if="type.includes('pdf')">
      <img :src="require('@/assets/pdf.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="doc" v-else-if="isDoc">
      <img :src="require('@/assets/doc.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
    <div class="file-item" v-else>
      <img :src="require('@/assets/wenjian.svg')" />
      <i class="el-icon-star-on" v-if="isCollection"></i>
    </div>
  </div>
</template>

<script>
import FileType from "./FileType";
export default {
  props: {
    item: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      rar: /x-rar-compressed/g,
    };
  },
  mixins: [FileType],
};
</script>

<style lang="less" scoped>
.files {
  width: 100px;
  height: 100px;
  & > div {
    width: 100px;
    height: 100px;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100px;
    }
    .el-icon-star-on {
      position: absolute;
      right: -20px;
      top: 0px;
      color: gold;
      font-size: 25px;
    }
  }
  .video {
    position: relative;
    .play {
      z-index: 1;
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
}
</style>