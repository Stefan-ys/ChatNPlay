import React from 'react';
import { Box, Typography } from '@mui/material';
import { PLAYER_1_COLOR, PLAYER_2_COLOR } from '../common/colors';

interface ProgressBarProps {
	boardData: number[][];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ boardData }) => {
	const flattenedBoard = boardData.flat();
	const player1Fields = flattenedBoard.filter((value) => value === 1 || (value >= 10 && value <= 19)).length;
	const player2Fields = flattenedBoard.filter((value) => value === 2 || (value >= 20 && value <= 29)).length;
	const neutralFields = flattenedBoard.filter((value) => value === 0 || value === 3).length;
	const totalFields = player1Fields + player2Fields + neutralFields;

	const player1Percentage = (player1Fields / totalFields) * 100;
	const player2Percentage = (player2Fields / totalFields) * 100;
	const neutralPercentage = (neutralFields / totalFields) * 100;

	return (
		<Box sx={{ width: '80%', mb: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
			<Box
				sx={{
					width: `${player1Percentage}%`,
					height: '24px',
					backgroundColor: PLAYER_1_COLOR,
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
					backgroundColor: PLAYER_2_COLOR,
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
	);
};

export default ProgressBar;
