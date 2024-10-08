import axios from 'axios';
import { UserResponse } from '../types/user.types';
import { API_GET_USERS_URL, API_USER_PROFILE_URL, API_UPDATE_PROFILE_URL } from '../common/urls';


export const getAllUsers = async (): Promise<UserResponse[]> => {
    try {
        const response = await axios.get(API_GET_USERS_URL);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
};

export const getUserProfile = async (userId: number): Promise<UserResponse> => {
    try {
        const response = await axios.get(`${API_USER_PROFILE_URL}/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
};

export const updateAvatar = async (userId: number, avatar: File) => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
        const response = await axios.post(`${API_UPDATE_PROFILE_URL}/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update avatar');
    }
};
