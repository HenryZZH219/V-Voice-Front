import request from '../utils/request';

// 登录接口
export const GetUserInfo = () => {
    const timestamp = new Date().getTime(); 
    return request({
        url: '/user/getuserinfo',
        method: 'get',
        params: {timestamp}
    })
}

// 登录接口
export const UpdateUser = (update) => {
    return request({
        url: '/user/updateUser',
        method: 'post',
        data:update
    })
}