import request from '../utils/request'

function modifyNick(params){
    return new Promise((resolve,reject)=>{
        request.post('/users/modifyNick',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function modifyPass(params){
    return new Promise((resolve,reject)=>{
        request.post('/users/modifyPass',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}


function modifyHeadImg(params){
    return new Promise((resolve,reject)=>{
        request.post('/users/modifyHeadImg',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function getUserInfo(params){
    return new Promise((resolve,reject)=>{
        request.post('/users/getUserInfo',params).then(response=>{
            resolve(response)
        }).catch(error=>{
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