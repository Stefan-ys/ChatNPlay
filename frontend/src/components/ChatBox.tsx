import React, { useState, useEffect, useRef } from 'react';
import { CommentRequest, CommentResponse } from '../types/comment.type';
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
	Snackbar,
} from '@mui/material';
import { createWebSocketClient } from '../utils/websocketUtil';
import { getChatById } from '../services/chat.service';
import { WebSocketReceivedData } from '../types/websocket.type';

interface ChatBoxProps {
	chatId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId }) => {
	const [comments, setComments] = useState<CommentResponse[]>([]);
	const [newComment, setNewComment] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { user } = useAuth();
	const commentsEndRef = useRef<null | HTMLDivElement>(null);
	const stompClientRef = useRef<any>(null);

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
		const setupWebSocket = async () => {
			const topic = `/topic/chat/${chatId}`;
			const client = await createWebSocketClient(
				topic,
				handleWebSocketMessage,
				(error) => {
					console.error('WebSocket error:', error.message);
					setErrorMessage(error.message);
				},
			);
			stompClientRef.current = client;
		};

		setupWebSocket();

		return () => {
			if (stompClientRef.current) {
				stompClientRef.current.disconnect(() => {
					console.log('WebSocket disconnected.');
				});
			}
		};
	}, [chatId]);

	const handleWebSocketMessage = (receivedData: WebSocketReceivedData) => {
		if (typeof receivedData === 'string') {
			setErrorMessage(receivedData);
		} else {
			handleCommentOperation(receivedData as CommentResponse);
		}
	};

	const handleCommentOperation = async (receivedComment: CommentResponse) => {
		try {
			if (
				receivedComment.type === 'ADD' ||
				receivedComment.type === 'EDIT'
			) {
				const updatedComments = await getChatById(chatId);
				setComments(updatedComments.comments);
			} else if (receivedComment.type === 'DELETE') {
				const updatedComments = await getChatById(chatId);
				setComments(updatedComments.comments);
			}
		} catch (error) {
			console.error('Error updating comments from the backend:', error);
			setErrorMessage('Failed to update comments.');
		}
	};

	const handleAddComment = () => {
		if (newComment.trim() && stompClientRef.current && user) {
			const commentData: CommentRequest = {
				id: -1,
				chatId: chatId,
				userId: user.id,
				content: newComment,
			};
			stompClientRef.current.send(
				`/app/chat/${chatId}/comment`,
				{},
				JSON.stringify(commentData),
			);
			setNewComment('');
		}
	};

	const handleCloseSnackbar = () => {
		setErrorMessage(null);
	};

	useEffect(() => {
		if (commentsEndRef.current) {
			commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [comments]);

	return (
		<Card
			variant='outlined'
			sx={{
				maxWidth: '1000px',
				margin: 'auto',
				borderRadius: 3,
				boxShadow: 3,
				backgroundColor: '#f5f5f5',
				color: '#333',
			}}
		>
			<CardContent>
				<Typography
					variant='h6'
					sx={{
						color: '#1976d2',
						borderBottom: '1px solid #ccc',
						pb: 1,
						mb: 2,
					}}
				>
					Game Lobby Chat
				</Typography>
				<Box
					sx={{
						maxHeight: '500px',
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						pb: 2,
					}}
				>
					<List>
						{comments.map((comment) => (
							<Comment
								key={comment.id}
								comment={comment}
								chatId={chatId}
								client={stompClientRef.current}
								isCurrentUser={comment.user.id === user?.id}
							/>
						))}
						<div ref={commentsEndRef} />
					</List>
				</Box>
				<Box sx={{ mt: 2, display: 'flex' }}>
					<TextField
						variant='outlined'
						placeholder='Type a message...'
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						fullWidth
						size='small'
						sx={{
							'& .MuiOutlinedInput-root': {
								color: '#000',
								backgroundColor: '#e0e0e0',
								borderRadius: '5px',
							},
						}}
					/>
					<Button
						onClick={handleAddComment}
						variant='contained'
						color='primary'
						sx={{ ml: 2, backgroundColor: '#1976d2' }}
					>
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
