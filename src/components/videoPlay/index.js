import Play from "./Play.vue"

export default {
    install(Vue) {
        let PlayComponent = Vue.extend(Play)
        let app = null
        Vue.prototype.$videPlayer = {
            show(option) {
                app = new PlayComponent({ propsData: { video_info: option } })
                app.$mount()
                document.body.appendChild(app.$el)
            },
            hide() {
                app.$el.remove()
                app = null
            }
        }
    }
}

