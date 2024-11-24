import React, { useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import Hexagon from '../components/Hexagon';
import backgroundImage from '../img/quizMazeImage.png';

const boardData = [
	[3, 8, 3, 0],
	[0, 18, 0, 8, 0],
	[3, 0, 8, 0],
	[8, 0, 0, 22, 0],
	[3, 0, 3, 0],
];

const QuizMazePage: React.FC = () => {
	const [currentPlayer, setCurrentPlayer] = useState(1);
	const [highlightedCells, setHighlightedCells] = useState<[number, number][]>([]);

	const flattenedBoard = boardData.flat();
	const player1Fields = flattenedBoard.filter((value) => value === 1 || (value >= 10 && value <= 19)).length;
	const player2Fields = flattenedBoard.filter((value) => value === 2 || (value >= 20 && value <= 29)).length;
	const neutralFields = flattenedBoard.filter((value) => value === 0 || value === 3).length;
	const totalFields = player1Fields + player2Fields + neutralFields;

	const player1Percentage = (player1Fields / totalFields) * 100;
	const player2Percentage = (player2Fields / totalFields) * 100;
	const neutralPercentage = (neutralFields / totalFields) * 100;

	const handleHover = (row: number, col: number) => {
		const neighbors = getNeighbors(row, col, currentPlayer, boardData);
		setHighlightedCells(neighbors);
	};

	const handleLeave = () => {
		setHighlightedCells([]);
	};

	const getNeighbors = (row: number, col: number, player: number, board: number[][]) => {
		const directions = [
			[-1, 0], // Top-left
			[-1, 1], // Top-right
			[0, -1], // Left
			[0, 1], // Right
			[1, 0], // Bottom-left
			[1, 1], // Bottom-right
		];
		const neighbors: [number, number][] = [];

		for (const [dx, dy] of directions) {
			const newRow = row + dx;
			const newCol = col + (row % 2 === 0 ? dy : dy - (dy === 1 ? 1 : 0));
			if (board[newRow]?.[newCol] !== undefined && board[newRow][newCol] !== -99) {
				neighbors.push([newRow, newCol]);
			}
		}
		return neighbors.filter(([r, c]) => {
			const cell = board[r][c];
			return player === 1 ? cell === 0 || cell === 3 || (cell >= 10 && cell <= 19) : cell === 0 || cell === 3 || (cell >= 20 && cell <= 29);
		});
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
			<Box sx={{ width: '80%', mb: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
				<Box
					sx={{
						width: `${player1Percentage}%`,
						height: '24px',
						backgroundColor: 'yellow',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{player1Fields > 0 && (
						<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'black' }}>
							Player 1: {player1Fields}
						</Typography>
					)}
				</Box>
				<Box
					sx={{
						width: `${neutralPercentage}%`,
						height: '24px',
						backgroundColor: 'lightgray',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{neutralFields > 0 && (
						<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'black' }}>
							Neutral: {neutralFields}
						</Typography>
					)}
				</Box>
				<Box
					sx={{
						width: `${player2Percentage}%`,
						height: '24px',
						backgroundColor: '#FF9999',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{player2Fields > 0 && (
						<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'black' }}>
							Player 2: {player2Fields}
						</Typography>
					)}
				</Box>
			</Box>

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
