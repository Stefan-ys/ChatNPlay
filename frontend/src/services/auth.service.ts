import axios from 'axios';
import { API_LOGIN_URL, API_LOGOUT_URL, API_REGISTER_URL } from '../common/urls';
import { LoginRequest, RegisterRequest } from '../types/auth.types';


export const register = async (registerData: RegisterRequest) => {
    try {
        const response = await axios.post(API_REGISTER_URL, registerData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const login = async (loginData: LoginRequest) => {
    try {
        const response = await axios.post(
            API_LOGIN_URL,
            loginData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const logout = async () => {
    try {
        await axios.post(API_LOGOUT_URL);
    } catch (error: any) {
        throw new Error('Logout failed');
    }
};
