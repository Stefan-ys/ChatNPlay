import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import LobbyUsersList from '../components/LobbyUsersList';
import { LobbyResponse } from '../types/lobby.type';
import { UserLobbyResponse } from '../types/user.type';
import { WebSocketReceivedData } from '../types/websocket.type';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { getLobbyByName } from '../services/lobby.service';
import { createWebSocketClient } from '../utils/websocketUtil';

const LobbyPage: React.FC<{ lobbyName: string }> = ({ lobbyName }) => {
	const [lobby, setLobby] = useState<LobbyResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [usersInLobby, setUsersInLobby] = useState<UserLobbyResponse[]>([]);
	const { user } = useAuth();
	const stompClientRef = useRef<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLobby = async () => {
			setIsLoading(true);
			try {
				const lobbyData = await getLobbyByName(lobbyName);
				setLobby(lobbyData);
				setError('');
			} catch (error: any) {
				console.error('Error fetching lobby:', error.message);
				setError('Failed to load lobby data. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchLobby();
	}, [lobbyName, user]);

	useEffect(() => {
		const setupWebSocket = async () => {
			if (!lobby || !user) return;

			const topic = `/topic/lobby/${lobby.id}`;
			try {
				const client = await createWebSocketClient(
					topic,
					(receivedData: WebSocketReceivedData) => handleWebSocketMessage(receivedData),
					(error) => {
						console.error('WebSocket connection error:', error.message);
						setError('WebSocket connection failed.');
					},
				);
				stompClientRef.current = client;
				handleAddUserToLobby();
			} catch (error: any) {
				console.error('Failed to connect WebSocket:', error.message);
				setError('Failed to establish WebSocket connection.');
			}
		};

		setupWebSocket();

		return () => {
			if (stompClientRef.current && stompClientRef.current.connected) {
				handleRemoveUserFromLobby();
				stompClientRef.current.disconnect(() => {});
			}
		};
	}, [lobby, user]);

	const handleWebSocketMessage = (receivedData: any) => {
		if (receivedData.USERS_UPDATE) {
			const usersUpdate = receivedData.USERS_UPDATE;
			setUsersInLobby(usersUpdate);
			setError(null);
		} else if (receivedData.GAME_START) {
			const { gameId, usersInLobby: updatedUsers } = receivedData.GAME_START;
			setUsersInLobby(updatedUsers);
			setError(null);

			if (gameId) {
				navigate(`/quiz-maze/${gameId}`);
			}
		} else {
			console.error('Unknown WebSocket message type:', receivedData);
			setError('Received unknown WebSocket message.');
		}
	};

	const handleAddUserToLobby = () => {
		if (stompClientRef.current?.connected && user && lobby) {
			stompClientRef.current.send(`/app/lobby/${lobby.id}/addUser`, {}, JSON.stringify(user.id));
		}
	};

	const handleRemoveUserFromLobby = () => {
		if (user && lobby) {
			stompClientRef.current.send(`/app/lobby/${lobby.id}/removeUser`, {}, JSON.stringify(user.id));
		}
	};

	const handleChangeUserStatus = () => {
		if (stompClientRef.current?.connected && user && lobby) {
			stompClientRef.current.send(`/app/lobby/${lobby.id}/changeStatus`, {}, JSON.stringify(user.id));
		}
	};

	return (
		<Container maxWidth='lg'>
			<Typography variant='h4' component='h1' gutterBottom>
				{lobby?.name || 'Loading lobby...'}
			</Typography>
			{isLoading ? (
				<Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
					<CircularProgress />
				</Box>
			) : error ? (
				<Alert severity='error' style={{ marginBottom: '20px' }}>
					{error}
				</Alert>
			) : (
				<Grid container spacing={2}>
					<Grid item xs={8}>
						<Box mb={4}>{lobby ? <ChatBox chatId={lobby.chatId} /> : <Typography variant='body1'>Loading chat...</Typography>}</Box>
					</Grid>
					<Grid item xs={4}>
						<LobbyUsersList users={usersInLobby} />
						<Box display='flex' justifyContent='center' alignItems='center' mt={2}>
							<Button
								variant='contained'
								color={usersInLobby.find((u) => u.id === user?.id)?.ready ? 'info' : 'success'}
								onClick={handleChangeUserStatus}
								sx={{ width: '150px' }}
							>
								{usersInLobby.find((u) => u.id === user?.id)?.ready ? 'Idle' : 'Ready'}
							</Button>
						</Box>
					</Grid>
				</Grid>
			)}
		</Container>
	);
};

export default LobbyPage;
