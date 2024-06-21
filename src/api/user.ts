import request from '../utils/request';

// 获取用户信息
export const GetUserInfo = () => {
    return request({
        url: '/user/getuserinfo',
        method: 'get',
    })
}

// 修改基本信息
export const UpdateUser = (update) => {
    return request({
        url: '/user/updateUser',
        method: 'put',
        data:update
    })
}

// 修改密码
export const UpdatePasswd = (update) => {
    return request({
        url: '/user/updatePasswd',
        method: 'put',
        data:update
    })
}