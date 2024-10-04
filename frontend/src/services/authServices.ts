import axios from 'axios';
import { API_LOGIN_URL, API_LOGOUT_URL, API_REGISTER_URL } from '../common/urls';


export const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
        const response = await axios.post(API_REGISTER_URL, { username, email, password, confirmPassword });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(API_LOGIN_URL, { username, password });
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
