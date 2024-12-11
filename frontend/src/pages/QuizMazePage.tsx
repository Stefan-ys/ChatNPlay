import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Hexagon from '../components/Hexagon';
import backgroundImage from '../img/quizMazeImage.png';
import { getLegalMoves } from '../assets/quizMazeLegalMoves';
import ProgressBar from '../components/ProgressBar';
import PlayerBox from '../components/PlayerBox';
import { QuizMazeGamesResponse, QuizMazePlayerResponse, QuizMazeResponse } from '../types/quiz-maze.type';
import { QuestionResponse } from '../types/question.type';
import QuestionModal from '../components/QuestionModal';
import { useAuth } from '../hooks/useAuth';
import { joinGame } from '../services/quiz-maze.service';
import { transformField } from '../assets/decoder';
import { createWebSocketClient } from '../utils/websocketUtil';
import { WebSocketReceivedData } from '../types/websocket.type';

const defaultBoard = [
	[0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 2, 0],
	[0, 0, 0, 0],
];

const topic = {
	id: 1,
	title: 'coding',
	imageUrl: '../img/quiz_topic_images/motherboard.png',
	description: 'description',
};

const question: QuestionResponse = {
	id: 1,
	topicTitle: 'Sample Topic',
	questionText: 'What is 2 + 2?',
	option1: '3',
	option2: '4',
	option3: '5',
	option4: '6',
	correctAnswer: '4',
	saved: true,
	topic: topic,
};

const player1: QuizMazePlayerResponse = {
	id: 1,
	playerNumber: 1,
	avatarUrl: 'https://example.com/avatar1.png',
	rank: 'Gold',
	username: 'Player 1',
	gameScore: 120,
	perks: [
		{ name: 'Shield', description: 'Blocks one attack.' },
		{ name: 'Speed', description: 'Increases movement.' },
	],
};

const player2: QuizMazePlayerResponse = {
	id: 2,
	playerNumber: 2,
	avatarUrl: 'https://example.com/avatar2.png',
	rank: 'Silver',
	username: 'Player 2',
	gameScore: 100,
	perks: [
		{ name: 'Double Points', description: 'Doubles points earned.' },
		{ name: 'Invisibility', description: 'Avoids detection for one move.' },
	],
};

const QuizMazePage: React.FC = () => {
	const { gameId } = useParams<{ gameId: string }>();
	const { user } = useAuth();
	const stompClientRef = useRef<any>(null);

	const [userPlayerNum, setUserPlayerNum] = useState(-1);
	const [legalMoves, setLegalMoves] = useState<number[][]>([]);
	const [highlightedCells, setHighlightedCells] = useState<[number, number][]>([]);
	const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
	const [openQuestionModal, setOpenQuestionModal] = useState(false);
	const [gameData, setGameData] = useState<QuizMazeGamesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchGameData = async () => {
			try {
				if (!gameId) {
					throw new Error('Invalid game ID');
				}
				setLoading(true);
				const response = await joinGame(gameId, user?.id || -1);
				const decodedField = transformField(response.field);
				setGameData({
					...response,
					field: decodedField,
				});
				setUserPlayerNum(response.player1.id === user?.id ? 1 : 2);
			} catch (err) {
				console.error('Failed to fetch game data:', err);
				setError('Failed to load game. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchGameData();
	}, [gameId, user]);

	useEffect(() => {
		const setupWebSocket = async () => {
			if (!gameData || !user) return;

			const topic = `/topic/quiz-maze/${gameId}`;
			try {
				const client = await createWebSocketClient(
					topic,
					(receivedData: any) => handleWebSocketMessage(receivedData),
					(error) => {
						console.error('WebSocket connection error:', error.message);
						setError('WebSocket connection failed.');
					},
				);
				stompClientRef.current = client;
			} catch (error) {
				console.error('Failed to connect WebSocket:', error.message);
				setError('Failed to establish WebSocket connection.');
			}
		};

		setupWebSocket();

		return () => {
			if (stompClientRef.current && stompClientRef.current.connected) {
				stompClientRef.current.disconnect(() => {});
			}
		};
	}, [gameId, user]);

	const handleWebSocketMessage = (receivedData: QuizMazeResponse) => {
		console.log('xoxoxoxox');
		if (receivedData.actionType === 'MOVE') {
			console.log('move ' + receivedData);
		}
	};

	useEffect(() => {
		setLegalMoves(getLegalMoves(gameData?.field || defaultBoard));
	}, [gameData?.field]);

	const isLegalMove = (row: number, col: number): boolean => {
		const legalValue = userPlayerNum === 1 ? 1 : 2;
		return legalMoves[row]?.[col] === legalValue || legalMoves[row]?.[col] === 3;
	};

	const handleHover = (row: number, col: number) => {
		if (isLegalMove(row, col)) {
			setHighlightedCells([[row, col]]);
		} else {
			setHighlightedCells([]);
		}
	};

	const handleLeave = () => {
		setHighlightedCells([]);
	};

	const handleCellSelect = (row: number, col: number) => {
		console.log('1');
		if (gameData?.playerTurnId === user?.id) {
			console.log('2');
			setSelectedCell([row, col]);
			if (stompClientRef.current?.connected && user && gameData) {
				stompClientRef.current.send(`/app/game/${gameId}/move`, {}, JSON.stringify({ row, col }));
			}
		}
	};

	const handleOpenQuestion = () => {
		setOpenQuestionModal(true);
	};

	const handleCloseQuestion = () => {
		setOpenQuestionModal(false);
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
				<Typography variant='h6' color='error'>
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				width: '100%',
				height: '100vh',
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'start',
				pt: 4,
				transform: 'scale(1.1)',
				transformOrigin: 'top',
				overflow: 'hidden',
			}}
		>
			{/* Progress bar */}
			<ProgressBar boardData={gameData?.field || defaultBoard} />

			{/* Player boxes */}
			<PlayerBox playerData={player1} position='left' currentPlayer={userPlayerNum} />
			<PlayerBox playerData={player2} position='right' currentPlayer={userPlayerNum} />

			{/* Game board */}
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{(gameData?.field || defaultBoard).map((row, rowIndex) => (
					<Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
						{row.map((value, colIndex) => (
							<Hexagon
								value={value}
								row={rowIndex}
								col={colIndex}
								key={`${rowIndex}-${colIndex}`}
								isHighlighted={highlightedCells.some(([r, c]) => r === rowIndex && c === colIndex)}
								isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
								onHover={handleHover}
								onLeave={handleLeave}
								onSelect={handleCellSelect}
								currentPlayer={userPlayerNum}
							/>
						))}
					</Box>
				))}
			</Box>

			{/* Trigger modal for demo */}
			<Button variant='contained' onClick={handleOpenQuestion} sx={{ mt: 2 }}>
				Open Question
			</Button>

			{/* Question Modal */}
			<QuestionModal open={openQuestionModal} question={question} onClose={handleCloseQuestion} timeLimit={gameData?.timeToAnswer || 30} />
		</Box>
	);
};

export default QuizMazePage;
