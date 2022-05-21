import request from '../utils/request'

function getFile(params) {
    return new Promise((resolve, reject) => {
        request.get('/api/file/getFile', {
            params: params
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function uploadFiles(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/upload', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
function merge(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/merge', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function uploadHeadImg(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/uploadHeadImg', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function delFile(params) {
    return new Promise((resolve, reject) => {
        request.get('/api/file/delFile', { params }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function mkdir(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/mkdir', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function modify(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/modify', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function move(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/move', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function getUserUsedDrive(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/getUsedDrive', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function getSearch(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/search', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function getFolder(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/getFolder', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function getCollection(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/getCollection', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function setCollection(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/setCollection', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function getPhoto(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/getPhoto', params).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

function downloadFile(file_id, drive_id) {
    return new Promise((resolve, reject) => {
        request.get(`/api/file/getFileDownloadUrl?file_id=${file_id}&drive_id=${drive_id}`)
            .then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}


function getFileTotal(params) {
    return new Promise((resolve, reject) => {
        request.post('/api/file/getFileTotal', params).then(res => resolve(res))
            .catch(err => reject(err))
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
    getFileTotal,
    uploadFiles,
    downloadFile,
    setCollection,
    getCollection,
    uploadHeadImg,
    getUserUsedDrive

}