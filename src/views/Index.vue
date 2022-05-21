<template>
  <el-container>
    <play />
    <el-aside width="auto" class="el-aside">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SideBar from "../components/SideBar/sidebar.vue";
import play from "../components/videoPlay/Play.vue";
export default {
  components: {
    play,
    SideBar,
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  methods: {
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("file", ["getFileTotle"]),
  },
  watch: {
    userInfo() {
      this.getFileTotle({ drive_id: this.userInfo.drive_id });
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style>
.el-aside {
  position: relative;
  overflow: hidden;
}
</style>