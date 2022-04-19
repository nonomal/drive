import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:3000'
// axios.defaults.baseURL = 'http://42.193.112.244:3000'
axios.defaults.baseURL = 'http://drive_node.xiezy.top'

let instance = axios.create({
    
})
instance.interceptors.request.use(config=>{
    return config
},err=>{
    return Promise.reject(err)
})

instance.interceptors.response.use(response=>{
    const res = response.data
    if(res.status == 200){
        return res.data
    }else{
        console.log(res)
        return Promise.reject(new Error(res.message || 'Error'))
    }
    
},error=>{
    return Promise.reject(error)
})

export default instance