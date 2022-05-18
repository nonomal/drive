import request from '../utils/request'

function Login(params) {
    return new Promise((resolve, reject) => {
        request.post('/author/login', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function Register(params) {
    return new Promise((resolve, reject) => {
        request.post('/author/register', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function sendPwd(params) {
    return new Promise((resolve, reject) => {
        request.get('/author/sendVerifyCode', { params }).then(response => resolve(response))
            .catch(error => reject(error))
    })
}

export {
    Login,
    Register,
    sendPwd
}