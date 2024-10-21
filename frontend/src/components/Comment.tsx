import React, { useState } from 'react';
import { CommentResponse } from '../types/comment.type';
import { updateComment, deleteComment } from '../services/lobby.service';
import { ListItem, ListItemText, IconButton, TextField, Button, Box, Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LobbyResponse } from '../types/lobby.type';

interface CommentProps {
    comment: CommentResponse;
    lobbyId: number;
    onCommentUpdated: (updatedLobby: LobbyResponse) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, lobbyId, onCommentUpdated }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>(comment.content);

    const handleEdit = async () => {
        const updatedComment = { content: editedContent, userId: comment.user.id };
        try {
            const updatedLobby = await updateComment(lobbyId, comment.id, updatedComment);
            onCommentUpdated(updatedLobby);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const updatedLobby = await deleteComment(lobbyId, comment.id);
            onCommentUpdated(updatedLobby);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
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
            </CardContent>
        </Card>
    );
};

export default Comment;
