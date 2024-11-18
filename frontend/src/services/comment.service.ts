import { API_COMMENT_URL } from '../common/urls';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import axiosUtil from '../utils/axiosUtil';


export const createComment = async (commentData: CommentRequest): Promise<CommentResponse> => {
    const response = await axiosUtil.post(API_COMMENT_URL, commentData);
    return response.data;
};

export const updateComment = async (commentId: number, CommentData: CommentResponse): Promise<CommentResponse> => {
    const response = await axiosUtil.put(`${API_COMMENT_URL}/${commentId}`, CommentData);
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await axiosUtil.delete(`${API_COMMENT_URL}/${commentId}`);
};