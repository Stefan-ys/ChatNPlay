import axios from 'axios';
import axiosInstance from './axiosInstance';
import { API_CHAT_URL } from '../common/urls';
import { CommentRequest } from '../types/comment.types';


export const addComment = async (chatId: number, commentData: CommentRequest): Promise<Comment> => {
  try {
    const response = await axiosInstance.post(`${API_CHAT_URL}/${chatId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getChatById = async (chatId: number) => {
  try {
    const response = await axiosInstance.get(`${API_CHAT_URL}/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};
