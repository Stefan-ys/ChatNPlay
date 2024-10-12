import { LobbyResponse } from '../types/lobby.types';
import { API_LOBBY_URL } from '../common/urls';
import axiosInstance from './axiosInstance';


export const getLobbyById = async (lobbyId: number): Promise<LobbyResponse> => {
    try {
        const response = await axiosInstance.get(`${API_LOBBY_URL}/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lobby:', error);
        throw error;
    }
};