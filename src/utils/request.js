// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

const request= axios.create({
    baseURL: 'http://toutiao-app.itheima.net/',
     // 自定义后端返回的原始数据
    //data:后端返回的原始数据，JSON格式的字符串
    transformResponse: [function (data) {
    // 对 data 进行任意转换处理
        try {
         return JSONBig.parse(data)
        } catch (err) {
            return data
     }
  }],  
})  
//request拦截器
request.interceptors.request.use(config => {
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization=`Bearer ${user.token}`
    }
    return config
},
    error => {
       return Promise.reject(error)
    }
)
export default request