import request from '../utils/request'


function Login(params){
    return new Promise((resolve,reject)=>{
        request.post('/login',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function Register(params){
    return new Promise((resolve,reject)=>{
        request.post('/login/Register',params).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

function sendPwd(params){
    return new Promise((resolve,reject)=>{
        request.get('/login/sendPwd',{params}).then(response=>{
            resolve(response)
        }).catch(error=>{
            reject(error)
        })
    })
}

export {
    Login,
    Register,
    sendPwd
}