import React, { useState } from 'react';
import { CommentResponse } from '../types/comment.type';
import { ListItem, ListItemText, IconButton, TextField, Button, Box, Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LobbyResponse } from '../types/lobby.type';

interface CommentProps {
    comment: CommentResponse;
    lobbyId: number;
    onCommentUpdated: (updatedLobby: LobbyResponse) => void;
    client: any;
}

const Comment: React.FC<CommentProps> = ({ comment, lobbyId, onCommentUpdated, client }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>(comment.content);

    const handleEdit = () => {
        const updatedComment = { content: editedContent, userId: comment.user.id };
        if (client) {
            client.publish({
                destination: `/app/lobby/${lobbyId}/editComment`,
                body: JSON.stringify({ commentId: comment.id, ...updatedComment }),
            });
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (client) {
            client.publish({
                destination: `/app/lobby/${lobbyId}/deleteComment`,
                body: JSON.stringify({ commentId: comment.id }),
            });
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
