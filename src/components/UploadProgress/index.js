import _UploadProgress from './UploadProgress.vue'


export default {
    install(Vue) {
        let UploadProgress = Vue.extend(_UploadProgress)
        let app = null
        Vue.prototype.$Progress = {
            init(Progress) {
                app = new UploadProgress({ propsData: { Progress } })
                app.$mount()
                document.body.appendChild(app.$el)
                setTimeout(() => {
                    app.setShow(true)
                })
            },
            update(Progress) {
                app.update(Progress)
            },
            close() {
                app.setShow(false)
            }
        }
    }
}