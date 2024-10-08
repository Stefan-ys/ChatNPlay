import { Comment } from './../types/types';
import axios from 'axios';
import { API_COMMENT_URL } from '../common/urls';
import { CommentBinding, CommentResponse } from '../types/comment.types';


export const createComment = async (commentData: CommentBinding): Promise<Comment> => {
    const response = await axios.post(API_COMMENT_URL, commentData);
    return response.data;
};

export const updateComment = async (commentId: number, CommentData: CommentResponse): Promise<Comment> => {
    const response = await axios.put(`${API_COMMENT_URL}/${commentId}`, CommentData);
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await axios.delete(`${API_COMMENT_URL}/${commentId}`);
};