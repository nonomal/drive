import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import NPlayer from "@nplayer/vue";

import './elementUse'

Vue.use(NPlayer)


Vue.config.productionTip = false

let app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default app
