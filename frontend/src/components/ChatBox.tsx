import React, { useState, useEffect } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import { useAuth } from '../hooks/useAuth';
import Comment from './Comment';
import { Box, Card, CardContent, Typography, TextField, Button, List } from '@mui/material';
import { LobbyResponse } from '../types/lobby.type';
import { Client } from '@stomp/stompjs'; // Import Client directly

interface ChatBoxProps {
    lobbyId: number;
    chat: CommentResponse[];
    onCommentUpdated: (updatedLobby: LobbyResponse) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ lobbyId, chat, onCommentUpdated }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            onConnect: () => {
                setIsConnected(true);
                stompClient.subscribe(`/topic/lobby/${lobbyId}/chat`, (message) => {
                    const newMessage: CommentResponse = JSON.parse(message.body);
                    onCommentUpdated(newMessage);
                });
            },
            onStompError: (error) => {
                console.error('WebSocket connection error:', error);
                setIsConnected(false);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [lobbyId, user]);

    const handleAddComment = () => {
        if (newComment.trim() && client && isConnected) {
            const newCommentData: CommentRequest = {
                content: newComment,
                userId: user.id,
                lobbyId: lobbyId,
            };

            client.publish({
                destination: `/app/lobby/${lobbyId}/comment`,
                body: JSON.stringify(newCommentData),
            });

            setNewComment('');
        } else {
            console.error('Cannot send comment: WebSocket connection not established.');
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">Chat</Typography>
                <List>
                    {chat.length > 0 ? (
                        chat.map((comment: CommentResponse) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                lobbyId={lobbyId}
                                onCommentUpdated={onCommentUpdated}
                                client={client}
                            />
                        ))
                    ) : (
                        <Typography variant="body1">No comments yet. Be the first to comment!</Typography>
                    )}
                </List>
                <Box mt={2} display="flex">
                    <TextField
                        label="Type a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ marginRight: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddComment}
                    >
                        Send
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChatBox;
