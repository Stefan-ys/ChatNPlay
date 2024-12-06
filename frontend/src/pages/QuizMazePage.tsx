import React, { useState, useEffect, useParams } from 'react';
import { Box, Button } from '@mui/material';
import Hexagon from '../components/Hexagon';
import backgroundImage from '../img/quizMazeImage.png';
import { getLegalMoves } from '../assets/quizMazeLegalMoves';
import ProgressBar from '../components/ProgressBar';
import PlayerBox from '../components/PlayerBox';
import { QuizMazePlayerResponse } from '../types/quiz-maze.type';
import { QuestionResponse } from '../types/question.type';
import QuestionModal from '../components/QuestionModal';

const boardData = [
	[3, 8, 3, 0],
	[0, 16, 1, 8, 0],
	[3, 1, 8, 0],
	[8, 2, 2, 22, 0],
	[3, 0, 3, 0],
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

const gameData = {
	id: 'id',
	title: 'Quiz Maze',
	version: '1.0',
	description: 'lorem ipsum... this is description',
	rules: '1.rule 2.rule 3.rule',
	timeToAnswer: 20,
	totalMovesAllowed: 30,
	timeToMove: 30,
	player1: player1,
	player2: player2,
	isPlayer1Turn: true,
	moves: 0,
	field: boardData,
};

const QuizMazePage: React.FC = () => {
	const { gameId } = useParams<{ gameId: string }>();

	const [currentPlayer, setCurrentPlayer] = useState(2);
	const [legalMoves, setLegalMoves] = useState<number[][]>([]);
	const [highlightedCells, setHighlightedCells] = useState<[number, number][]>([]);
	const [openQuestionModal, setOpenQuestionModal] = useState(false);

	useEffect(() => {
		if (gameId) {
			// TODO Fetch game data based on the gameId
		}
	}, [gameId]);

	useEffect(() => {
		setLegalMoves(getLegalMoves(boardData));
	}, []);

	const isLegalMove = (row: number, col: number): boolean => {
		const legalValue = currentPlayer === 1 ? 1 : 2;
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

	const handleOpenQuestion = () => {
		setOpenQuestionModal(true);
	};

	const handleCloseQuestion = () => {
		setOpenQuestionModal(false);
	};

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
			<ProgressBar boardData={boardData} />

			{/* Player boxes */}
			<PlayerBox playerData={player1} position='left' currentPlayer={currentPlayer} />
			<PlayerBox playerData={player2} position='right' currentPlayer={currentPlayer} />

			{/* Game board */}
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{boardData.map((row, rowIndex) => (
					<Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
						{row.map((value, colIndex) => (
							<Hexagon
								value={value}
								row={rowIndex}
								col={colIndex}
								key={`${rowIndex}-${colIndex}`}
								isHighlighted={highlightedCells.some(([r, c]) => r === rowIndex && c === colIndex)}
								onHover={handleHover}
								onLeave={handleLeave}
								currentPlayer={currentPlayer}
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
			<QuestionModal open={openQuestionModal} question={question} onClose={handleCloseQuestion} timeLimit={gameData.timeToAnswer} />
		</Box>
	);
};

export default QuizMazePage;
