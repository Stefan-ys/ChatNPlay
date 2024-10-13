import axios from 'axios';
import { API_URL } from '../common/urls';
import { refreshToken } from './auth.service';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                console.error('Token is missing. Redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const newToken = await refreshToken();

                if (newToken) {
                    localStorage.setItem('token', newToken);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                    return axiosInstance(originalRequest);
                } else {
                    console.error('Failed to refresh token. Logging out...');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }

            if (error.response.status === 403) {
                console.error('Access denied');
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
