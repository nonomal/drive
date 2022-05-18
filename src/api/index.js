import request from '../utils/request'

function getShareUrl(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/share/getShareUrl', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
function getYiYan() {
    return new Promise((resolve, reject) => {
        request.get('/yiyan/getYiyan').then(response => {
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