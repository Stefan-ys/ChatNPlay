// Comment.tsx
import React, { useState } from 'react';
import { CommentResponse } from '../types/comment.types';
import { updateComment, deleteComment } from '../services/comment.service';
import {
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CommentProps {
    comment: CommentResponse;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>(comment.content);

    const handleEdit = async () => {
        const updatedComment = { ...comment, content: editedContent };
        await updateComment(comment.id, updatedComment); 
        setIsEditing(false);
    };

    const handleDelete = async (id: number) => {
        await deleteComment(id);
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
                            <IconButton onClick={() => handleDelete(comment.id)} aria-label="delete">
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
