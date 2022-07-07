import Audio from "./Audio.vue"

export default {
    install(Vue) {
        let AudioComponent = Vue.extend(Audio)
        let app = null
        Vue.prototype.$audioPlayer = {
            show(option) {
                app = new AudioComponent({ propsData: { audio_info: option } })
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

