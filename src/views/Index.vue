<template>
    <el-container>
        <play/>
        <el-aside style="width:250px">
            <Nav/>
        </el-aside>
        <el-container>
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- <el-footer>Footer</el-footer> -->
        </el-container>
        
    </el-container>
</template>

<script>
import Nav from '../components/Nav_Aside.vue'
import play from '../components/videoPlay/Play.vue'
export default {
    components:{
        Nav,
        play
    }
}
</script>

<style>

</style>