import { LobbyResponse } from '../types/lobby.type';
import { CommentRequest } from '../types/comment.type';
import axiosInstance from './axiosInstance';
import { API_LOBBY_URL } from '../common/urls';

export const getLobbyById = async (lobbyId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.get(`${API_LOBBY_URL}/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lobby by ID:', error);
        throw error; 
    }
};

export const getLobbyByName = async (lobbyName: string): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.get(`${API_LOBBY_URL}/name/${lobbyName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lobby by name:', error);
        throw error;
    }
};

export const createComment = async (lobbyId: number, commentRequest: CommentRequest): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.post(`${API_LOBBY_URL}/${lobbyId}/comments`, commentRequest);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

export const updateComment = async (lobbyId: number, commentId: number, commentRequest: CommentRequest): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.put(`${API_LOBBY_URL}/${lobbyId}/comments/${commentId}`, commentRequest);
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};

export const deleteComment = async (lobbyId: number, commentId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.delete(`${API_LOBBY_URL}/${lobbyId}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};

export const addUserToLobby = async (lobbyId: number, userId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.post(`${API_LOBBY_URL}/${lobbyId}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding user to lobby:', error);
        throw error;
    }
};

export const removeUserFromLobby = async (lobbyId: number, userId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.delete(`${API_LOBBY_URL}/${lobbyId}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing user from lobby:', error);
        throw error;
    }
};
