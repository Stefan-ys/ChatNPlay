import React from 'react';
import { Box, Typography } from '@mui/material';
import CastleIcon from '@mui/icons-material/Castle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LandscapeIcon from '@mui/icons-material/Landscape';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const PLAYER_1_COLOR = '#ffec3e';
export const PLAYER_2_COLOR = '#FF6F6F';

interface HexagonProps {
	value: number;
	row: number;
	col: number;
	isHighlighted: boolean;
	isSelected: boolean;
	onHover: (row: number, col: number) => void;
	onLeave: () => void;
	onSelect: (row: number, col: number) => void;
	currentPlayer: number;
}

const Hexagon: React.FC<HexagonProps> = ({ value, row, col, isHighlighted, isSelected, onHover, onLeave, onSelect, currentPlayer }) => {
	const getColor = () => {
		if (value === 1 || (value >= 10 && value <= 19)) return PLAYER_1_COLOR;
		if (value === 2 || (value >= 20 && value <= 29)) return PLAYER_2_COLOR;
		if (value === 8) return '#c0c0c0';
		return 'lightgreen';
	};

	const getHighlightColor = () => {
		if (currentPlayer === 1) return PLAYER_1_COLOR;
		if (currentPlayer === 2) return PLAYER_2_COLOR;
		return 'transparent';
	};

	const renderIcon = () => {
		if (value === 8) {
			return <LandscapeIcon sx={{ fontSize: 36, color: '#8c8c8c' }} />;
		}
		if (value >= 10 && value <= 30) {
			const heartsCount = value % 10;
			const rows = [];
			let remainingHearts = heartsCount;

			for (let i = 0; i < 2; i++) {
				const heartsInRow = Math.min(remainingHearts, 3);
				rows.push(
					<Box key={i} sx={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
						{Array.from({ length: heartsInRow }).map((_, index) => (
							<FavoriteIcon key={index} sx={{ fontSize: 12, color: 'red' }} />
						))}
					</Box>,
				);
				remainingHearts -= heartsInRow;
				if (remainingHearts <= 0) break;
			}

			return (
				<>
					<CastleIcon sx={{ fontSize: 36, color: 'brown' }} />
					{rows}
				</>
			);
		}

		if (value === 3) {
			return <AutoAwesomeIcon sx={{ fontSize: 36, color: 'goldenrod' }} />;
		}

		return null;
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: 95,
				height: 95,
				clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
				margin: '6px',
				marginBottom: '-16px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				transition: 'transform 0.2s ease, box-shadow 0.2s ease',
				background: `linear-gradient(to top, ${
					isSelected
						? `rgba(0, 0, 0, 0.3), ${getHighlightColor()}`
						: isHighlighted
							? `rgba(0, 0, 0, 0.3), ${getHighlightColor()}`
							: 'rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0.1)'
				})`,
				boxShadow: isSelected
					? '0 0 15px 4px rgba(255, 255, 255, 0.8)'
					: isHighlighted
						? '0 0 15px 4px rgba(255, 255, 255, 0.8)'
						: '0 4px 8px rgba(0, 0, 0, 0.2)',
			}}
			onMouseEnter={() => value !== 8 && onHover(row, col)}
			onMouseLeave={() => value !== 8 && onLeave()}
			onClick={() => isHighlighted && onSelect(row, col)}
		>
			<Box
				sx={{
					width: 80,
					height: 80,
					clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
					backgroundColor: getColor(),
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					transition: 'background 0.3s ease, transform 0.2s ease',
				}}
			>
				{renderIcon() || (
					<Typography variant='body2' sx={{ pointerEvents: 'none', color: 'black' }}>
						{}
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default Hexagon;
