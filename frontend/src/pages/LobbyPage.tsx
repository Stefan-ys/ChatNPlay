import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import { LobbyResponse } from '../types/lobby.type';
import { getLobbyByName, addUserToLobby, removeUserFromLobby } from '../services/lobby.service';
import { Container, Box, Typography } from '@mui/material';
import LobbyUsersList from '../components/LobbyUsersList';
import { useAuth } from '../hooks/useAuth';

const LobbyPage: React.FC<{ lobbyName: string }> = ({ lobbyName }) => {
    const [lobby, setLobby] = useState<LobbyResponse | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const lobbyData = await getLobbyByName(lobbyName);
                setLobby(lobbyData);
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
                    <ChatBox chatId={lobby.chatId} />
                ) : (
                    <Typography variant="body1">Loading chat...</Typography>
                )}
            </Box>
            <LobbyUsersList users={lobby?.users || []} />
        </Container>
    );
};

export default LobbyPage;
