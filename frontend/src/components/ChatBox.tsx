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
	const commentsEndRef = useRef<null | HTMLDivElement>(null);
	const isInitialLoad = useRef(true);

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
			const client = createWebSocketClient(
				topic,
				(receivedData: WebSocketReceivedData) =>
					handleWebSocketMessage(receivedData),
				(error: WebSocketError) => {
					console.error('WebSocket connection error:', error.message);
					setErrorMessage(error.message);
				},
			);
			setStompClient(client);
		};

		setupWebSocket();

		return () => {
			if (stompClient) {
				stompClient.disconnect(() => {
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

	const handleCommentOperation = (receivedComment: CommentResponse) => {
		if (receivedComment.type === 'ADD') {
			setComments((prevComments) => [...prevComments, receivedComment]);
		} else if (receivedComment.type === 'EDIT') {
			setComments((prevComments) =>
				prevComments.map((comment) =>
					comment.id === receivedComment.id
						? receivedComment
						: comment,
				),
			);
		} else if (receivedComment.type === 'DELETE') {
			setComments((prevComments) =>
				prevComments.filter(
					(comment) => comment.id !== receivedComment.id,
				),
			);
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
			stompClient.send(
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
		if (isInitialLoad.current && comments.length > 0) {
			commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
			isInitialLoad.current = false;
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
								client={stompClient}
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
