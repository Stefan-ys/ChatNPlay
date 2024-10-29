import { API_CHAT_URL } from "../common/urls";
import { ChatResponse } from "../types/chat.type";
import axiosInstance from "./axiosInstance";

export const getChatById = async (chatId: number): Promise<ChatResponse> => {
    try {
        const response = await axiosInstance.get(`${API_CHAT_URL}/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat by ID:', error);
        throw error; 
    }
};