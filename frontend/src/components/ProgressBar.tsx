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
		<Box sx={{ width: '80%', mb: 2, display: 'flex', alignItems: 'center', position: 'relative', borderRadius: '10px' }}>
			{/* Player 1 section */}
			<Box
				sx={{
					width: `${player1Percentage}%`,
					height: '24px',
					background: `linear-gradient(135deg, ${PLAYER_1_COLOR}, #f1e300)`,
					borderRadius: '10px 0 0 10px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
					transition: 'width 0.3s ease-in-out',
				}}
			>
				{player1Fields > 0 && (
					<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', px: 1 }}>
						{player1Fields}
					</Typography>
				)}
			</Box>

			{/* Neutral section */}
			<Box
				sx={{
					width: `${neutralPercentage}%`,
					height: '24px',
					background: 'linear-gradient(135deg, #e0e0e0, #d3d3d3)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
					transition: 'width 0.3s ease-in-out',
				}}
			>
				{neutralFields > 0 && (
					<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', px: 1 }}>
						{neutralFields}
					</Typography>
				)}
			</Box>

			{/* Player 2 section */}
			<Box
				sx={{
					width: `${player2Percentage}%`,
					height: '24px',
					background: `linear-gradient(135deg, ${PLAYER_2_COLOR}, #ff4c4c)`,
					borderRadius: '0 10px 10px 0',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
					transition: 'width 0.3s ease-in-out',
				}}
			>
				{player2Fields > 0 && (
					<Typography variant='caption' sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', px: 1 }}>
						{player2Fields}
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default ProgressBar;
