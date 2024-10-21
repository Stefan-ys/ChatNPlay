import React, { useState } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import { createComment } from '../services/lobby.service';
import { useAuth } from '../hooks/useAuth';
import Comment from './Comment';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    List,
} from '@mui/material';
import { LobbyResponse } from '../types/lobby.type';

interface ChatBoxProps {
    lobbyId: number;
    chat: CommentResponse[];
    onCommentUpdated: (updatedLobby: LobbyResponse) => void; 
}

const ChatBox: React.FC<ChatBoxProps> = ({ lobbyId, chat, onCommentUpdated }) => {
    const [newComment, setNewComment] = useState<string>('');
    const { user } = useAuth();

    const handleAddComment = async () => {
        console.log("Attempting to add comment:", newComment);
        if (newComment.trim() && user) {
            const newCommentData: CommentRequest = {
                content: newComment,
                userId: user.id,
                lobbyId: lobbyId,
            };

            try {
                const updatedLobby = await createComment(lobbyId, newCommentData);
                setNewComment('');
                onCommentUpdated(updatedLobby);
            } catch (error) {
                console.error("Error creating comment:", error);
            }
        } else {
            console.error("User is not authenticated or comment is empty.");
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
