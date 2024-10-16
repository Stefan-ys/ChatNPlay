import axios from 'axios';
import { API_URL } from '../common/urls';
import { refreshToken } from './auth.service';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const clearStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user')
}

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                console.error('Token is missing. Redirecting to login...');
                clearStorage();
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
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            console.error("Network or CORS error:", error.message);
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const errorCode = error.response.data?.errorCode;
            if (errorCode === 'TOKEN_EXPIRED') {
                try {
                    const response = await refreshToken();
                    if (response) {
                        const { accessToken: newToken, refreshToken: newRefreshToken } = response;
                        localStorage.setItem('accessToken', newToken);
                        localStorage.setItem('refreshToken', newRefreshToken);
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
                    } else {
                        console.error('Failed to refresh token. Logging out...');
                        clearStorage();
                        window.location.href = '/login';
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    clearStorage();
                    window.location.href = '/login';
                }
            } else {
                console.error('Authentication error:', error.response.data?.error);
                clearStorage();
                window.location.href = '/login';
            }
        }

        if (error.response.status === 403) {
            console.error('Access denied - insufficient permissions');
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
