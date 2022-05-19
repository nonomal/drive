import axios from 'axios'
import app from '../main'

let instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API
})
instance.interceptors.request.use(config => {
    config.headers['authorization'] = `Bearer ${localStorage.getItem('token')}`
    return config
}, err => {
    return Promise.reject(err)
})

instance.interceptors.response.use(response => {
    const res = response.data
    if (response.status == 200) {
        return res
    } else {
        return Promise.reject(new Error(res.message || 'Error'))
    }
}, error => {
    if (error.response) {
        if (error.response.status == 403) {
            app.$message.error('验证失败，请重新登录！')
            setTimeout(() => {
                app.$router.replace('/login')
            }, 1000)
        } else {
            return Promise.reject(error.message)
        }
    } else {
        return Promise.reject(error.message)
    }
})

export default instance