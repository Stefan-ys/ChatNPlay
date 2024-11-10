import React, { useState } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
import {
	Typography,
	IconButton,
	TextField,
	Button,
	Box,
	Card,
	CardContent,
	Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserAvatar from './UserAvatar';

interface CommentProps {
	comment: CommentResponse;
	chatId: number;
	client: any;
	isCurrentUser: boolean;
}

const Comment: React.FC<CommentProps> = ({
	comment,
	chatId,
	client,
	isCurrentUser,
}) => {
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
			client.send(
				`/app/chat/${chatId}/edit-comment`,
				{},
				JSON.stringify(updatedComment),
			);
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
			client.send(
				`/app/chat/${chatId}/delete-comment`,
				{},
				JSON.stringify(deletedComment),
			);
		}
	};

	const handleCloseSnackbar = () => {
		setErrorMessage(null);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: isCurrentUser ? 'flex-start' : 'flex-end',
				my: 1,
				pr: isCurrentUser ? 2 : 0,
				pl: isCurrentUser ? 0 : 2,
			}}
		>
			{isCurrentUser && (
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					width='80px'
				>
					<Typography variant='subtitle2' color='textSecondary'>
						{comment.user.username}
					</Typography>
					<UserAvatar
						avatarUrl={comment.user.avatarUrl}
						userId={comment.user.id}
					/>
				</Box>
			)}
			<Card
				variant='outlined'
				sx={{
					maxWidth: '60%',
					backgroundColor: isCurrentUser ? '#cfe9ff' : '#f0f0f0',
					color: '#000',
					borderRadius: 10,
					boxShadow: 1,
				}}
			>
				<CardContent>
					{isEditing ? (
						<Box display='flex' alignItems='center'>
							<TextField
								value={editedContent}
								onChange={(e) =>
									setEditedContent(e.target.value)
								}
								variant='outlined'
								size='small'
								fullWidth
								sx={{ mr: 1 }}
							/>
							<Button
								onClick={handleEdit}
								color='primary'
								variant='contained'
							>
								Save
							</Button>
						</Box>
					) : (
						<Typography variant='body1'>
							{comment.content}
						</Typography>
					)}
					{isCurrentUser && !isEditing && (
						<Box display='flex' justifyContent='flex-end' mt={1}>
							<IconButton
								onClick={() => setIsEditing(true)}
								aria-label='edit'
								color='inherit'
								size='small'
							>
								<EditIcon fontSize='small' />
							</IconButton>
							<IconButton
								onClick={handleDelete}
								aria-label='delete'
								color='inherit'
								size='small'
							>
								<DeleteIcon fontSize='small' />
							</IconButton>
						</Box>
					)}
					<Typography variant='caption' color='textSecondary'>
						{new Date(comment.createdAt).toLocaleString()}
					</Typography>
				</CardContent>
			</Card>
			{!isCurrentUser && (
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					width='80px'
				>
					<Typography variant='subtitle2' color='textSecondary'>
						{comment.user.username}
					</Typography>
					<UserAvatar
						avatarUrl={comment.user.avatarUrl}
						userId={comment.user.id}
					/>
				</Box>
			)}
			<Snackbar
				open={!!errorMessage}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				message={errorMessage}
			/>
		</Box>
	);
};

export default Comment;
