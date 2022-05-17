import request from '../utils/request'

function modifyNick(params) {
    return new Promise((resolve, reject) => {
        request.post('/user/modifyNick', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function modifyPass(params) {
    return new Promise((resolve, reject) => {
        request.post('/user/modifyCipher', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}


function modifyHeadImg(params) {
    return new Promise((resolve, reject) => {
        request.post('/user/modifyHeadImg', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function getUserInfo(params) {
    return new Promise((resolve, reject) => {
        request.post('/user/getUserInfo', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}


export {
    modifyNick,
    modifyHeadImg,
    modifyPass,
    getUserInfo
}