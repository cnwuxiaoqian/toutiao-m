
//用户相关模块
import request from '@/utils/request'
// import store from '@/store'
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}
// 发送验证码，每分钟限制发送一次
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url:`/v1_0/sms/codes/${mobile}`
    })
}
//获取用户自己的信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user',
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}