import request from '../utils/request'

function getShareUrl(params) {
    return new Promise((resolve, reject) => {
        request.post('/share/getShareUrl', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
function getYiYan() {
    return new Promise((resolve, reject) => {
        request.get('/share/yiyan').then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

export {
    getShareUrl,
    getYiYan
}