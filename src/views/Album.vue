<template>
<div class="album">
    <Folder/>
</div>
</template>

<script>
import Folder from './Folder.vue'
export default {
    components:{
        Folder
    },
    created(){
        this.$store.commit('setFavorite','album')
    },
}
</script>

<style>
</style>