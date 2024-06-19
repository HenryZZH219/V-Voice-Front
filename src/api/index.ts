import request from '../utils/request';

// export const fetchData = () => {
//     return request({
//         url: './mock/table.json',
//         method: 'get'
//     });
// };

// export const fetchUserData = () => {
//     return request({
//         url: './mock/user.json',
//         method: 'get'
//     });
// };

// export const fetchRoleData = () => {
//     return request({
//         url: './mock/role.json',
//         method: 'get'
//     });
// };


// 登录接口
export const Login = (user) => {
    return request({
      url: '/index/register',
      method: 'post',
      data: user,
    })
  }
  