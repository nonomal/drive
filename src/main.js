import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import videoPlay from './components/videoPlay';
import audioPlay from './components/Audio/index'
import PhotoView from './components/PhotoView'
import UploadProgress from './components/UploadProgress'
import directives from './directives'


Vue.use(videoPlay)
Vue.use(audioPlay)
Vue.use(PhotoView, true)
Vue.use(directives)
Vue.use(UploadProgress)
Vue.config.productionTip = false
import './elementUse'
let app = new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')

export default app
