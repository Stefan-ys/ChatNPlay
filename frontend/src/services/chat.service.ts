import axios from 'axios';
import { Comment } from '../types/types';
import { API_CHAT_URL } from '../common/urls';
import { CommentBinding } from '../types/comment.types';


export const addComment = async (chatId: number, commentData: CommentBinding): Promise<Comment> => {
  try {
    const response = await axios.post(`${API_CHAT_URL}/${chatId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getChatById = async (chatId: number) => {
  try {
    const response = await axios.get(`${API_CHAT_URL}/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};
