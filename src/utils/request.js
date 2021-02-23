// 请求模块
import axios from 'axios'

const request= axios.create({
    baseURL:'http://toutiao-app.itheima.net/'
})
//request拦截器
// request.interceptors.request.use(config => {
//     config.headers['Content-Type'] = 'text/plain'
//     return config
// },
//     error => {
//         console.log(error);
//         Promise.reject(error)
//     }
// )
export default request