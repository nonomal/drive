import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


import user from './user'
import file from './file'
import sideBar from './sideBar'

export default new Vuex.Store({
  modules: {
    user,
    file,
    sideBar
  }
})
