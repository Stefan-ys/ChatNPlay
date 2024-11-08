import axios from 'axios';
import { API_URL } from '../common/urls';
import { refreshToken } from '../services/auth.service';

const axiosUtil = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const clearStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

axiosUtil.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
axiosUtil.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);

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
                            axiosUtil.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axiosUtil(originalRequest);
                        }
                        console.error('Failed to refresh token. Logging out...');
                        clearStorage();
                        window.location.href = '/login';

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
            } else if (error.response.status === 403) {
                console.error('Access denied - insufficient permissions');
            }
        } else {
            console.error('No response received:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosUtil;
