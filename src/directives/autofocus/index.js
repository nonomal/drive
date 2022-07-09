export default ['focus', {
    inserted(el) {
        if (!el) return
        let inputDom = el.querySelector('.el-input__inner')
        if (inputDom) inputDom.focus()
        inputDom = null
    }
}]