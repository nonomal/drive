import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:JSON.parse(localStorage.getItem('userInfo')),
    parent_file_id:'root',
    arryCheck:[],
    routers:[{
      name:'首页',
      path:'root'
    }],
    isOpen:false,
    video_info:null,
    favorite:'file',
  },
  mutations: {
    parent_file_id(state,payload){
      state.parent_file_id = payload
    },
    add_router(state,payload){
      state.routers.push(payload)
    },
    del_router(state,payload){
      let arr = state.routers
      let arr_length = arr.length
      arr.splice(payload+1,arr_length)
    },
    setFavorite(state,payload){
      state.favorite = payload
    }
  },
  actions: {
  },
  modules: {
  },
  getters:{
  }
})
