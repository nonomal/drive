import request from '../utils/request'
import axios from 'axios'

function getFile(params){
    return new Promise((resolve,reject)=>{
        request.get('/file/getFile',{
            params:params
        }).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function uploadFiles(params){
    return new Promise((resolve,reject)=>{
        request.post('http://42.193.112.244:3000/file/upload',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}
function merge(params){
    return new Promise((resolve,reject)=>{
        request.post('http://42.193.112.244:3000/file/merge',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function uploadHeadImg(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/uploadHeadImg',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function delFile(params){
    return new Promise((resolve,reject)=>{
        request.get('/file/delFile',{params}).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function mkdir(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/mkdir',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function modify(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/modify',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function move(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/move',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function getUserUsedDrive(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/getUsedDrive',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function getSearch(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/search',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function getFolder(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/getFolder',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function getCollection(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/getCollection',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function setCollection(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/setCollection',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function getPhoto(params){
    return new Promise((resolve,reject)=>{
        request.post('/file/getPhoto',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function downloadFile(params){
    return new Promise((resolve,reject)=>{
        axios.get(`/download?file_id=${params}`,{
            responseType:'blob'
        }).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

export {
    move,
    mkdir,
    merge,
    modify,
    getFile,
    delFile,
    getPhoto,
    getFolder,
    getSearch,
    uploadFiles,
    downloadFile,
    setCollection,
    getCollection,
    uploadHeadImg,
    getUserUsedDrive
    
}