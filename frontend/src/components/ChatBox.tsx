import React, { useState } from 'react';
import { ChatResponse } from '../types/chat.types';
import { CommentBinding, CommentResponse } from '../types/comment.types';
import { createComment } from '../services/comment.service';
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


interface ChatBoxProps {
    chat: ChatResponse;
}


const ChatBox: React.FC<ChatBoxProps> = ({ chat }) => {
    const [newComment, setNewComment] = useState<string>('');
    const { user } = useAuth();

    const handleAddComment = async () => {
        if (newComment.trim() && user) {
            const newCommentData: CommentBinding = {
                content: newComment,
                userId: user.id,
                chatId: chat?.id,
            };

            await createComment(newCommentData);
            setNewComment('');

        } else {
            console.error("User is not authenticated or comment is empty.");
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">Chat</Typography>
                <List>
                    {chat?.comments?.map((comment: CommentResponse) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
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
