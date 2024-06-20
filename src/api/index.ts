import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};


// 登录接口
export const LoginApi = (user) => {
  return request({
    url: '/index/login',
    method: 'post',
    data: user,
  })
}

export const RegisterApi = (user) => {
  return request({
    url: '/index/register',
    method: 'post',
    data: user,
  })
}


// 登录接口
export const Logout = () => {
  return request({
    url: '/index/logout',
    method: 'get',
  })
}