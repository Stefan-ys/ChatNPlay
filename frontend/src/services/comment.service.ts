import { API_COMMENT_URL } from '../common/urls';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import axiosUtil from '../utils/axiosUtil';

export const createComment = async (commentData: CommentRequest): Promise<CommentResponse> => {
	try {
		const response = await axiosUtil.post(API_COMMENT_URL, commentData);
		return response.data;
	} catch (error) {
		console.error('Error creating comment:', error);
		throw error;
	}
};

export const updateComment = async (commentId: number, commentData: CommentResponse): Promise<CommentResponse> => {
	try {
		const response = await axiosUtil.put(`${API_COMMENT_URL}/${commentId}`, commentData);
		return response.data;
	} catch (error) {
		console.error(`Error updating comment with ID ${commentId}:`, error);
		throw error;
	}
};

export const deleteComment = async (commentId: number): Promise<void> => {
	try {
		await axiosUtil.delete(`${API_COMMENT_URL}/${commentId}`);
	} catch (error) {
		console.error(`Error deleting comment with ID ${commentId}:`, error);
		throw error;
	}
};
