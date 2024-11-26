import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Hexagon from '../components/Hexagon';
import backgroundImage from '../img/quizMazeImage.png';
import { PLAYER_1_COLOR, PLAYER_2_COLOR } from '../common/colors';
import { getLegalMoves } from '../assets/quizMazeLegalMoves';
import ProgressBar from '../components/ProgressBar';

const boardData = [
	[3, 8, 3, 0],
	[0, 16, 1, 8, 0],
	[3, 1, 8, 0],
	[8, 2, 2, 22, 0],
	[3, 0, 3, 0],
];

const QuizMazePage: React.FC = () => {
	const [currentPlayer, setCurrentPlayer] = useState(1);
	const [legalMoves, setLegalMoves] = useState<number[][]>([]);
	const [highlightedCells, setHighlightedCells] = useState<[number, number][]>([]);

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
			}}
		>
			{/* Progress bar */}
			<ProgressBar boardData={boardData} />

			{/* Game board */}
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{boardData.map((row, rowIndex) => (
					<Box
						key={rowIndex}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: '5px',
							marginLeft: rowIndex % 2 === 0 ? '0px' : '0px',
						}}
					>
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
		</Box>
	);
};

export default QuizMazePage;
