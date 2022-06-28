import request from '../utils/request'

function getFile(params) {
    return request.get('/api/file/getFile', { params })
}

function uploadFiles(params) {
    return request.post('/api/file/upload', params)
}

function merge(params) {
    return request.post('/api/file/merge', params)
}

function uploadHeadImg(params) {
    return request.post('/api/file/uploadHeadImg', params)
}

function delFile(params) {
    return request.get('/api/file/delFile', { params })
}

function mkdir(params) {
    return request.post('/api/file/mkdir', params)
}

function modify(params) {
    return request.post('/api/file/modify', params)
}

function move(params) {
    return request.post('/api/file/move', params)
}

function getUserUsedDrive(params) {
    return request.post('/api/file/getUsedDrive', params)
}

function getSearch(params) {
    return request.post('/api/file/search', params)
}

function getFolder(params) {
    return request.post('/api/file/getFolder', params)
}

function getCollection(params) {
    return request.post('/api/file/getCollection', params)
}

function setCollection(params) {
    return request.post('/api/file/setCollection', params)
}

function getPhoto(params) {
    return request.post('/api/file/getPhoto', params)
}

function downloadFile(file_id, drive_id) {
    return request.get(`/api/file/getFileDownloadUrl?file_id=${file_id}&drive_id=${drive_id}`)
}


function getFileTotal(params) {
    return request.post('/api/file/getFileTotal', params)
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
    getFileTotal,
    uploadFiles,
    downloadFile,
    setCollection,
    getCollection,
    uploadHeadImg,
    getUserUsedDrive

}