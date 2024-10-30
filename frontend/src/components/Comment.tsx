import React, { useState } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import { ListItem, ListItemText, IconButton, TextField, Button, Box, Card, CardContent, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CommentProps {
    comment: CommentResponse;
    chatId: number;
    client: any;
}

const Comment: React.FC<CommentProps> = ({ comment, chatId, client }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleEdit = () => {
        if (client) {
            const updatedComment: CommentRequest = {
                id: comment.id,
                chatId: chatId,
                userId: comment.user.id,
                content: editedContent,
            };
            client.send(`/app/chat/${chatId}/edit-comment`, {}, JSON.stringify(updatedComment));
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (client) {
            const deletedComment: CommentRequest = {
                id: comment.id,
                chatId: chatId,
                userId: comment.user.id,
                content: '',
            };
            client.send(`/app/chat/${chatId}/delete-comment`, {}, JSON.stringify(deletedComment));
        }
    };

    const handleErrorMessage = (message: string) => {
        setErrorMessage(message);
    };

    const handleCloseSnackbar = () => {
        setErrorMessage(null);
    };

    return (
        <Card variant="outlined" style={{ margin: '10px 0' }}>
            <CardContent>
                <ListItem>
                    {isEditing ? (
                        <Box display="flex" alignItems="center" width="100%">
                            <TextField
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ marginRight: 1 }}
                            />
                            <Button onClick={handleEdit} color="primary" variant="contained">
                                Save
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <ListItemText primary={comment.content} secondary={comment.user.username} />
                            <IconButton onClick={() => setIsEditing(true)} aria-label="edit">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleDelete} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </ListItem>
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

export default Comment;
