<template>
  <transition name="slide-to-right">
    <div class="upload_file_state" v-if="isShowProgress">
      <el-card class="box-card">
        <span>上传进度：</span>
        <div class="item-inner">
          <div v-for="(item, index) in ProgressArr" :key="index" class="item">
            <span class="file_name">{{ item.fileInfo.fileName }}</span>
            <el-progress
              v-if="!isNaN(item.fileInfo.percentage)"
              :percentage="item.fileInfo.percentage"
              style="width: 280px; display: inline-block"
            ></el-progress>
          </div>
        </div>
        <p>tip：上传过程中不要离开此页面</p>
      </el-card>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShowProgress: false,
      ProgressArr: [],
    };
  },
  props: {
    Progress: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.ProgressArr = this.Progress;
  },
  methods: {
    setShow(state) {
      this.isShowProgress = state;
    },
    update(Progress) {
      this.ProgressArr = Progress;
    },
  },
};
</script>

<style lang="less" scoped>
.upload_file_state {
  .box-card {
    width: 420px;
    position: absolute;
    right: 10px;
    bottom: 20px;
    .item-inner {
      width: 380px;
      height: 130px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .item {
        width: 100%;
        padding: 10px 0;
        .file_name {
          width: 100%;
          overflow: hidden;
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    p {
      font-size: 13px;
      color: #aaa;
      margin: 0px;
    }
  }
}
.slide-to-right-enter-active,
.slide-to-right-leave-active {
  transition: all 0.5s ease;
}
.slide-to-right-enter,
.slide-to-right-leave-to {
  opacity: 0;
}
</style>