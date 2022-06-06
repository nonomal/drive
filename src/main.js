import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import NPlayer from "@nplayer/vue";

import './elementUse'
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
  preload: 1,
  loading: require('./assets/loading.gif'),
  error: require('./assets/error.png')
})

Vue.use(NPlayer)


Vue.config.productionTip = false

let app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default app
