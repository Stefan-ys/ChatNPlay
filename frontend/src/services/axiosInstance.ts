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

                // Attempt to refresh the token
                const newToken = await refreshToken();

                if (newToken) {
                    // Save new token to localStorage
                    localStorage.setItem('token', newToken);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                    // Retry the original request with the new token
                    return axiosInstance(originalRequest);
                } else {
                    // Handle the case where refresh token fails, log out user
                    // Optionally redirect to login page
                    console.error('Failed to refresh token. Logging out...');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login'; // Redirect to login
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
