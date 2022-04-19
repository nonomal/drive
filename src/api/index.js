import request from '../utils/request'

function getShareUrl(params){
    return new Promise((resolve,reject)=>{
        request.post('/getShareUrl',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

export {
    getShareUrl
}