<template>
  <div class="album">
    <Folder />
  </div>
</template>


<script>
import { mapMutations } from "vuex";
import Folder from "./Folder.vue";
export default {
  components: {
    Folder,
  },
  methods: {
    ...mapMutations("file", ["SET_FAVORITE"]),
  },
  created() {
    this.SET_FAVORITE("album");
  },
};
</script>

<style>
.album {
  height: calc(100vh - 40px);
}
</style>