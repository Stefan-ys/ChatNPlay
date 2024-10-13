import axiosInstance from './axiosInstance';
import { API_LOGIN_URL, API_LOGOUT_URL, API_REFRESH_TOKEN_URL, API_REGISTER_URL } from '../common/urls';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

export const register = async (registerData: RegisterRequest) => {
    try {
        const response = await axiosInstance.post(API_REGISTER_URL, registerData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const login = async (loginData: LoginRequest) => {
    try {
        const response = await axiosInstance.post(API_LOGIN_URL, loginData);
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const logout = async () => {
    try {
        await axiosInstance.post(API_LOGOUT_URL);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    } catch (error: any) {
        throw new Error('Logout failed');
    }
};

export const refreshToken = async (): Promise<string | null> => {
    console.log("Refreshing token...");
    try {
        const refreshTokenFromStorage = localStorage.getItem('refreshToken');
        const response = await axiosInstance.post(API_REFRESH_TOKEN_URL, { requestRefreshToken: refreshTokenFromStorage });
        const newAccessToken = response.data.accessToken;
        return newAccessToken;
    } catch (error) {
        console.error('Token refresh failed', error);
        return null;
    }
};
