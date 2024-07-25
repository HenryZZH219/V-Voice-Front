import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import router from '@/router'
const service: AxiosInstance = axios.create({
    // baseURL: 'http://localhost:8501',
    baseURL: `${window.location.protocol}//${window.location.hostname}:8501`,
    timeout: 5000
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        if (token) {
            config.headers['token'] = `${token}`; // 将 token 添加到请求头
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data.code == 208) {
            router.push('/login');
            return Promise.reject(new Error(response.data.message || 'Error'));
        }else if (response.status === 200) {
            return response;
        } else {
            console.log(response);
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
