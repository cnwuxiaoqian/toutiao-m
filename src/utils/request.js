// 请求模块
import axios from 'axios'
import store from '@/store'

const request= axios.create({
    baseURL:'http://toutiao-app.itheima.net/'
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