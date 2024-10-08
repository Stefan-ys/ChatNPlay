import axios from 'axios';
import { Lobby } from '../types/types';
import { API_LOBBY_URL } from '../common/urls';


export const getLobbyById = async (lobbyId: number): Promise<Lobby> => {
    try {
        const response = await axios.get(`${API_LOBBY_URL}/${lobbyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lobby:', error);
        throw error;
    }
};