import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const service: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8501',
    timeout: 5000
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // 将 token 添加到请求头
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
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
