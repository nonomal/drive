import request from '../utils/request'


function Login(params) {
    return new Promise((resolve, reject) => {
        request.post('/unauthor/login', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function Register(params) {
    return new Promise((resolve, reject) => {
        request.post('/unauthor/register', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function sendPwd(params) {
    return new Promise((resolve, reject) => {
        request.get('/unauthor/sendVerifyCode', { params }).then(response => resolve(response))
            .catch(error => reject(error))
    })
}

export {
    Login,
    Register,
    sendPwd
}