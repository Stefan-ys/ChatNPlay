import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import { LobbyResponse } from '../types/lobby.type';
import { getLobbyByName, addUserToLobby, removeUserFromLobby } from '../services/lobby.service';
import { Container, Box, Typography } from '@mui/material';
import { CommentResponse } from '../types/comment.type';
import LobbyUsersList from '../components/LobbyUsersList';
import { useAuth } from '../hooks/useAuth';
import { createLobbyWebSocket, closeLobbyWebSocket } from '../utils/lobby-websocket.util';
import { Client } from '@stomp/stompjs';

const LobbyPage: React.FC<{ lobbyName: string }> = ({ lobbyName }) => {
    const [lobby, setLobby] = useState<LobbyResponse | null>(null);
    const [chat, setChat] = useState<CommentResponse[]>([]);
    const { user } = useAuth();
    let client: Client | null = null;

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const lobbyData = await getLobbyByName(lobbyName);
                setLobby(lobbyData);
                setChat(lobbyData.chat || []);
                if (user) {
                    await handleAddUser(user.id);
                }
            } catch (error) {
                console.error('Error fetching lobby:', error);
            }
        };

        fetchLobby();

        return () => {
            if (user && lobby) {
                handleRemoveUser(user.id);
            }
        };
    }, [lobbyName, user]);

    useEffect(() => {
        if (!lobby) return;

        client = createLobbyWebSocket(
            lobby.id,
            (comment) => {
                if (typeof comment === 'string') {
                    console.log(comment);
                } else {
                    setChat((prevChat) => [...prevChat, comment]);
                }
            },
            () => {
                console.log('WebSocket connected');
            },
            (error) => {
                console.error('WebSocket error:', error);
            }
        );

        return () => {
            if (client) {
                closeLobbyWebSocket(client);
            }
        };
    }, [lobby?.id]);

    const handleAddUser = async (userId: number) => {
        if (!lobby) return;
        try {
            const updatedLobby = await addUserToLobby(lobby.id, userId);
            setLobby(updatedLobby);
        } catch (error) {
            console.error("Error adding user to lobby:", error);
        }
    };

    const handleRemoveUser = async (userId: number) => {
        if (!lobby) return;
        try {
            const updatedLobby = await removeUserFromLobby(lobby.id, userId);
            setLobby(updatedLobby);
        } catch (error) {
            console.error("Error removing user from lobby:", error);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                {lobby?.name || 'Loading lobby...'}
            </Typography>
            <Box mb={4}>
                {lobby ? (
                    <>
                        <ChatBox
                            lobbyId={lobby.id}
                            chat={chat}
                            onCommentUpdated={(updatedLobby) => setLobby(updatedLobby)}
                        />
                    </>
                ) : (
                    <Typography variant="body1">Loading chat...</Typography>
                )}
            </Box>
            <LobbyUsersList users={lobby?.users || []} />
        </Container>
    );
};

export default LobbyPage;
