import React, { useEffect, useState, useRef } from 'react';
import ChatBox from '../components/ChatBox';
import LobbyUsersList from '../components/LobbyUsersList';
import { LobbyResponse } from '../types/lobby.type';
import { getLobbyByName } from '../services/lobby.service';
import { Container, Grid, Typography, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { createWebSocketClient } from '../utils/websocketUtil';
import { WebSocketReceivedData } from '../types/websocket.type';
import { UserResponse } from '../types/user.type';

const LobbyPage: React.FC<{ lobbyName: string }> = ({ lobbyName }) => {
    const [lobby, setLobby] = useState<LobbyResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { user } = useAuth();
    const [activeUsers, setActiveUsers] = useState<UserResponse[]>([]);
    const stompClientRef = useRef<any>(null); 

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const lobbyData = await getLobbyByName(lobbyName);
                setLobby(lobbyData);
            } catch (error) {
                console.error('Error fetching lobby:', error);
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
                    (receivedData: WebSocketReceivedData) =>
                        handleWebSocketMessage(receivedData),
                    (error) => {
                        console.error(
                            'WebSocket connection error:',
                            error.message,
                        );
                        setErrorMessage(error.message);
                    },
                );
    
                stompClientRef.current = client; 
                handleAddUserToLobby();
            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
            }
        };
    
        setupWebSocket();
    
        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                handleRemoveUserFromLobby();
                stompClientRef.current.disconnect(() => {
                    console.log('WebSocket disconnected.');
                });
            }
        };
    }, [lobby, user]);
    


    const handleWebSocketMessage = (receivedData: WebSocketReceivedData) => {
        console.log('Received data:', receivedData);
        if (typeof receivedData === 'string') {
            setErrorMessage(receivedData);
        } else {
            setActiveUsers(receivedData);
        }
    };

    const handleAddUserToLobby = () => {
        if (stompClientRef.current?.connected && user && lobby) {
            console.log('Sending addUserToLobby message...');
            stompClientRef.current.send(
                `/app/lobby/${lobby.id}/addUser`,
                {},
                JSON.stringify(user.id),
            );
        } else {
            console.log('WebSocket connection is not open yet.');
        }
    };

    const handleRemoveUserFromLobby = () => {
        if (stompClientRef.current?.connected && user && lobby) {
            console.log("****");
            stompClientRef.current.send(
                `/app/lobby/${lobby.id}/removeUser`,
                {},
                JSON.stringify(user.id),
            );
        }
    };

    return (
        <Container maxWidth='lg'>
            <Typography variant='h4' component='h1' gutterBottom>
                {lobby?.name || 'Loading lobby...'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Box mb={4}>
                        {lobby ? (
                            <ChatBox chatId={lobby.chatId} />
                        ) : (
                            <Typography variant='body1'>
                                Loading chat...
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <LobbyUsersList users={activeUsers} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default LobbyPage;
