import PhotoView from './PhotoView'
import VueLazyload from 'vue-lazyload'
import { isObject } from './utils/getDataType'
export default {
    install(Vue, vueLazyConfig) {
        Vue.component(PhotoView.name, PhotoView)
        setVueLazy(Vue, vueLazyConfig)
        Vue.prototype.$photoview = function (imageData, currentIndex) {
            let PhotoViewF = Vue.extend(PhotoView)
            let app = new PhotoViewF({ propsData: { imageData, currentIndex: currentIndex } })
            app.$mount()
            document.body.appendChild(app.$el)
            setTimeout(() => {
                app.setShow(true)
            })
        }
    }
}


function setVueLazy(Vue, vueLazyConfig) {
    if (!vueLazyConfig || (typeof vueLazyConfig == 'boolean' && vueLazyConfig)) {
        Vue.use(VueLazyload, {
            loading: require('./assets/loading.gif'),
            error: require('./assets/error.png'),
            perload: 1
        })
    } else if (isObject(vueLazyConfig)) {
        Vue.use(VueLazyload, vueLazyConfig)
    }
}