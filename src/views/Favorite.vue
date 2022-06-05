<template>
  <div class="favorite">
    <Folder />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Folder from "./Folder.vue";
export default {
  data() {
    return {};
  },
  components: {
    Folder,
  },
  methods: {
    ...mapMutations("file", ["SET_FAVORITE"]),
  },
  created() {
    this.SET_FAVORITE("favorite");
  },
};
</script>

<style>
.favorite {
  height: calc(100vh - 40px);
}
</style>