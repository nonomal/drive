import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


import user from './user'
import file from './file'
export default new Vuex.Store({
  modules: {
    user,
    file
  }
})
