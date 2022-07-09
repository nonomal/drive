import autofocus from './autofocus'
import drag from './drag'
let directives = [autofocus, drag]

export default {
    install(Vue) {
        directives.forEach(directive => {
            let [id, options] = directive
            Vue.directive(id, options)
        })
    }
}