import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import UserList from '../components/UserList';
import { LobbyResponse } from '../types/lobby.types';
import { getLobbyById } from '../services/lobby.service';
import { Container, Box, Typography } from '@mui/material';
import { createLobbyUpdateWebSocket  } from '../utils/lobbyWebSocket';


const LobbyPage: React.FC<{ lobbyId: number }> = ({ lobbyId }) => {
    const [lobby, setLobby] = useState<LobbyResponse | null>(null);

    useEffect(() => {
        const fetchLobby = async () => {
            const lobbyData = await getLobbyById(lobbyId);
            setLobby(lobbyData);
        };

        fetchLobby();

        const client = createLobbyUpdateWebSocket (lobbyId, (updatedLobby: LobbyResponse) => {
            setLobby(updatedLobby);
        });

        return () => {
            client.deactivate();
        };
    }, [lobbyId]);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                {lobby?.name}
            </Typography>
            <Box mb={4}>
                {lobby && lobby.chat ? (
                    <ChatBox chat={lobby.chat} />
                ) : (
                    <Typography variant="body1">Loading chat...</Typography>
                )}
            </Box>
            <UserList users={lobby?.users || []} />
        </Container>
    );
};

export default LobbyPage;
