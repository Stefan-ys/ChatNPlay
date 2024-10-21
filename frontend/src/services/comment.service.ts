import { API_COMMENT_URL } from '../common/urls';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import axiosInstance from './axiosInstance';


export const createComment = async (commentData: CommentRequest): Promise<Comment> => {
    const response = await axiosInstance.post(API_COMMENT_URL, commentData);
    return response.data;
};

export const updateComment = async (commentId: number, CommentData: CommentResponse): Promise<Comment> => {
    const response = await axiosInstance.put(`${API_COMMENT_URL}/${commentId}`, CommentData);
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await axiosInstance.delete(`${API_COMMENT_URL}/${commentId}`);
};