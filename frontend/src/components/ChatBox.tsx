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
            (receivedData: WebSocketReceivedData) => handleWebSocketMessage(receivedData),
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


    const handleWebSocketMessage = (receivedData: WebSocketReceivedData) => {
        if (typeof receivedData === 'string') {
            setErrorMessage(receivedData);
        } else {
            handleCommentOperation(receivedData as CommentResponse);
        }
    };

    const handleCommentOperation = (receivedComment: CommentResponse) => {
        if (receivedComment.type === 'ADD') {
            setComments((prevComments) => [...prevComments, receivedComment]);
        } else if (receivedComment.type === 'EDIT') {
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === receivedComment.id ? receivedComment : comment
                )
            );
        } else if (receivedComment.type === 'DELETE') {
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== receivedComment.id)
            );
        } else {
            console.warn('Unknown comment operation type:', receivedComment.type);
        }
    };

    const handleAddComment = () => {
        if (newComment.trim() && stompClient && user) {
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
