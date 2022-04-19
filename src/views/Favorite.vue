<template>
    <div class="favorite">
        <Folder/>
    </div>
</template>

<script>
import Folder from './Folder.vue'
export default {
    data(){
        return{
        }
    },
    components:{
        Folder
    },
    created(){
        this.$store.commit('setFavorite','favorite')
    }
}
</script>

<style>

</style>