import React, { useState, useEffect } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import { useAuth } from '../hooks/useAuth';
import Comment from './Comment';
import { Box, Card, CardContent, Typography, TextField, Button, List } from '@mui/material';
import { LobbyResponse } from '../types/lobby.type';
import { createLobbyWebSocket, closeLobbyWebSocket } from '../utils/lobby-websocket.util';

interface ChatBoxProps {
    lobbyId: number;
    chat: CommentResponse[];
    onCommentUpdated: (updatedLobby: LobbyResponse) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ lobbyId, chat, onCommentUpdated }) => {
    const [newComment, setNewComment] = useState<string>('');
    const { user } = useAuth();
    const [client, setClient] = useState<any>(null);

    useEffect(() => {
        const clientInstance = createLobbyWebSocket(lobbyId, handleNewMessage, () => setIsConnected(true), () => setIsConnected(false));
        setClient(clientInstance);

        return () => {
            closeLobbyWebSocket(clientInstance);
        };
    }, [lobbyId]);

    const handleNewMessage = (comment: CommentResponse | string) => {
        console.log('New message received:', comment);
    };

    const handleAddComment = () => {
        if (newComment.trim() && user && client) {
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
