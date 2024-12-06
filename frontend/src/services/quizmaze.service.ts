import { API_QUIZ_MAZE_URL } from '../common/urls';
import { LobbyResponse } from '../types/lobby.type';
import axiosUtil from '../utils/axiosUtil';


export const joinGame = async (gameId: string, playerId: number): Promise<LobbyResponse> => {
	try {
		const response = await axiosUtil.get(`${API_QUIZ_MAZE_URL}/join/${gameId}`, { playerId });
		return response.data;
	} catch (error) {
		console.error('Error starting new game:', error);
		throw error;
	}
};
