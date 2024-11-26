import { API_GET_USERS_URL, API_USER_PROFILE_URL, API_UPDATE_PROFILE_URL } from '../common/urls';
import { UserResponse } from '../types/user.type';
import axiosUtil from '../utils/axiosUtil';

/**
 * Fetches all users.
 * @returns An array of `UserResponse` objects.
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
	try {
		const response = await axiosUtil.get(API_GET_USERS_URL);
		return response.data;
	} catch (error: any) {
		console.error('Error fetching all users:', error);
		throw new Error(error.response?.data?.message || 'Failed to fetch users');
	}
};

/**
 * Fetches the profile of a specific user by ID.
 * @param userId The ID of the user.
 * @returns A `UserResponse` object containing user profile information.
 */
export const getUserProfile = async (userId: number): Promise<UserResponse> => {
	try {
		const response = await axiosUtil.get(`${API_USER_PROFILE_URL}/${userId}`);
		return response.data;
	} catch (error: any) {
		console.error(`Error fetching user profile for user ID ${userId}:`, error);
		throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
	}
};

/**
 * Updates the avatar of a specific user.
 * @param userId The ID of the user.
 * @param avatar The new avatar file to upload.
 * @returns The updated user profile data or server response.
 */
export const updateAvatar = async (userId: number, avatar: File) => {
	const formData = new FormData();
	formData.append('avatar', avatar);

	try {
		const response = await axiosUtil.post(`${API_UPDATE_PROFILE_URL}/${userId}/avatar`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error: any) {
		console.error(`Error updating avatar for user ID ${userId}:`, error);
		throw new Error(error.response?.data?.message || 'Failed to update avatar');
	}
};
