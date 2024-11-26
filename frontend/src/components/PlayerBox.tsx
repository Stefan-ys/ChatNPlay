import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import PlayerPerkBadge from './PlayerPerkBadge';
import { QuizMazePlayerResponse } from '../types/quiz-maze.type';
import image from '../img/image.png';
import { PLAYER_1_COLOR, PLAYER_2_COLOR } from '../common/colors';

interface PlayerBoxProps {
	playerData: QuizMazePlayerResponse;
	position: 'left' | 'right';
	currentPlayer: number;
}

const PlayerBox: React.FC<PlayerBoxProps> = ({ playerData, position, currentPlayer }) => {
	const isCurrentPlayer = playerData.playerNumber === currentPlayer;

	return (
		<Box
			sx={{
				position: 'fixed',
				top: '25%',
				[position]: '1%',
				backgroundColor: '#ffffff',
				backgroundImage: `url(${image})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				padding: isCurrentPlayer ? 3 : 2,
				borderRadius: 2,
				boxShadow: isCurrentPlayer ? '0 12px 30px rgba(0, 0, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.3)',
				border: `8px solid ${playerData.playerNumber === 1 ? PLAYER_1_COLOR : PLAYER_2_COLOR}`,
				width: isCurrentPlayer ? '200px' : '180px',
				textAlign: 'center',
				transition: 'all 0.3s ease-in-out',
				zIndex: -100,
				transform: 'scale(0.9)',
				overflow: 'hidden',
			}}
		>
			<Avatar
				src={playerData.avatarUrl}
				alt={playerData.username}
				sx={{
					width: isCurrentPlayer ? 80 : 60,
					height: isCurrentPlayer ? 80 : 60,
					margin: '0 auto 10px auto',
					border: '5px solid',
					borderColor: playerData.playerNumber === 1 ? PLAYER_1_COLOR : PLAYER_2_COLOR,
					borderRadius: '50%',
				}}
			/>
			<Box
				sx={{
					backgroundColor: '#e0f7fa',
					padding: '5px 10px',
					borderRadius: '8px',
					margin: '10px 0',
					boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Typography
					variant='subtitle1'
					sx={{
						fontWeight: 'bold',
						fontSize: isCurrentPlayer ? '1rem' : '0.9rem',
						color: '#004d40',
					}}
				>
					{playerData.username}
				</Typography>
			</Box>
			<Box
				sx={{
					width: '100px',
					backgroundColor: '#eceff1',
					padding: '5px',
					borderRadius: '8px',
					margin: '0 auto 8px auto',
					boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Typography
					variant='subtitle2'
					sx={{
						color: '#455a64',
						fontWeight: '600',
						fontSize: '0.8rem',
					}}
				>
					Rank: {playerData.rank}
				</Typography>
			</Box>
			<Box
				sx={{
					width: '100px',
					backgroundColor: '#ffd54f',
					padding: '5px',
					borderRadius: '8px',
					margin: '0 auto',
					boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Typography
					variant='body2'
					sx={{
						fontWeight: 'bold',
						fontSize: '0.85rem',
						color: '#6d4c41',
					}}
				>
					Score: {playerData.gameScore}
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					flexWrap: 'wrap',
					gap: '5px',
					mt: 2,
				}}
			>
				{playerData.perks.map((perk, index) => (
					<PlayerPerkBadge key={index} perk={perk} />
				))}
			</Box>
		</Box>
	);
};

export default PlayerBox;
