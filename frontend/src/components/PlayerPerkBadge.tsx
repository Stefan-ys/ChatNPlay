import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { QuizMazePerkResponse } from '../interfaces/QuizMazePerkResponse';

interface PlayerPerkBadgeProps {
	perk: QuizMazePerkResponse;
}

const PlayerPerkBadge: React.FC<PlayerPerkBadgeProps> = ({ perk }) => {
	return (
		<Tooltip title={`${perk.name}: ${perk.description}`} arrow>
			<Box
				sx={{
					width: 40,
					height: 40,
					borderRadius: '50%',
					backgroundColor: '#f0f0f0',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
					cursor: 'pointer',
				}}
			>
				<Typography variant='body2' sx={{ fontWeight: 'bold', fontSize: 12 }}>
					{perk.name.charAt(0).toUpperCase()}
				</Typography>
			</Box>
		</Tooltip>
	);
};

export default PlayerPerkBadge;
