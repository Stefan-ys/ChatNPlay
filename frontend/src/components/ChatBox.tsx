import React, { useState, useEffect } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import { useAuth } from '../hooks/useAuth';
import Comment from './Comment';
import { Box, Card, CardContent, Typography, TextField, Button, List, Snackbar } from '@mui/material';
import { createWebSocketClient } from '../utils/websocketUtil';
import { getChatById } from '../services/chat.service';
import { WebSocketReceivedData } from '../types/websocket.type';
import { WebSocketError } from '../types/error.type';

interface ChatBoxProps {
    chatId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId }) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [stompClient, setStompClient] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const chatData = await getChatById(chatId);
                setComments(chatData.comments);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };
        fetchChat();
    }, [chatId]);

    useEffect(() => {
        const topic = `/topic/chat/${chatId}`;

        const client = createWebSocketClient(
            topic,
            (receivedData: WebSocketReceivedData) => {
                if (typeof receivedData === 'string') {
                    setErrorMessage(receivedData);
                } else if (typeof receivedData === 'number') {
                    setComments((prevComments) =>
                        prevComments.filter((comment) => comment.id !== receivedData)
                    );
                } else {
                    const receivedComment: CommentResponse = receivedData;
                    setComments((prevComments) => {
                        const existingIndex = prevComments.findIndex(
                            (comment) => comment.id === receivedComment.id
                        );
                        if (existingIndex > -1) {
                            return prevComments.map((comment) =>
                                comment.id === receivedComment.id ? receivedComment : comment
                            );
                        } else {
                            return [...prevComments, receivedComment];
                        }
                    });
                }
            },
            (error: WebSocketError) => {
                console.error('WebSocket connection error:', error.message);
                setErrorMessage(error.message);
            }
        );

        setStompClient(client);

        return () => {
            client.disconnect(() => console.log('Disconnected WebSocket'));
        };
    }, [chatId]);

    const handleAddComment = () => {
        if (newComment.trim() && stompClient) {
            const commentData: CommentRequest = {
                id: -1,
                chatId: chatId,
                userId: user.id,
                content: newComment,
            };
            stompClient.send(`/app/chat/${chatId}/comment`, {}, JSON.stringify(commentData));
            setNewComment('');
        }
    };

    const handleCloseSnackbar = () => {
        setErrorMessage(null);
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">Chat</Typography>
                <List>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} chatId={chatId} client={stompClient} />
                        ))
                    ) : (
                        <Typography>No comments yet.</Typography>
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
                    <Button variant="contained" color="primary" onClick={handleAddComment}>
                        Send
                    </Button>
                </Box>
                <Snackbar
                    open={!!errorMessage}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={errorMessage}
                />
            </CardContent>
        </Card>
    );
};

export default ChatBox;
