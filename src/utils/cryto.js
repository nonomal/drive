import CryptoJS from 'crypto-js'

function getPassMD5(str){
    return CryptoJS.MD5(str+'xiezy').toString().toLowerCase()
}

function getMD5(str){
    return CryptoJS.MD5(str).toString().toLowerCase()
}

export {
    getMD5,
    getPassMD5
}