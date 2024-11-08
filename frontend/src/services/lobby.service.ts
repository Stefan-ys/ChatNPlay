import { LobbyResponse } from '../types/lobby.type';
import axiosUtil from '../utils/axiosUtil';
import { API_LOBBY_URL } from '../common/urls';

export const getLobbyById = async (lobbyId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosUtil.get(`${API_LOBBY_URL}/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lobby by ID:', error);
        throw error; 
    }
};

export const getLobbyByName = async (lobbyName: string): Promise<LobbyResponse> => {
    try {
        const response = await axiosUtil.get(`${API_LOBBY_URL}/name/${lobbyName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lobby by name:', error);
        throw error;
    }
};


export const addUserToLobby = async (lobbyId: number, userId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosUtil.post(`${API_LOBBY_URL}/${lobbyId}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding user to lobby:', error);
        throw error;
    }
};

export const removeUserFromLobby = async (lobbyId: number, userId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosUtil.delete(`${API_LOBBY_URL}/${lobbyId}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing user from lobby:', error);
        throw error;
    }
};
