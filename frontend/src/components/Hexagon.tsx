import React from 'react';
import { Box, Typography } from '@mui/material';
import CastleIcon from '@mui/icons-material/Castle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LandscapeIcon from '@mui/icons-material/Landscape';

interface HexagonProps {
	value: number;
	row: number;
	col: number;
	isHighlighted: boolean;
	onHover: (row: number, col: number) => void;
	onLeave: () => void;
	currentPlayer: number;
}

const Hexagon: React.FC<HexagonProps> = ({ value, row, col, isHighlighted, onHover, onLeave, currentPlayer }) => {
	const getColor = () => {
		if (value === 1 || (value >= 10 && value <= 19)) return 'yellow';
		if (value === 2 || (value >= 20 && value <= 29)) return '#FF9999';
		return 'lightgreen';
	};

	const renderIcon = () => {
		if (value === 8) {
			return <LandscapeIcon sx={{ fontSize: 40, color: 'gray' }} />;
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
							<FavoriteIcon key={index} sx={{ fontSize: 10, color: 'red' }} />
						))}
					</Box>,
				);
				remainingHearts -= heartsInRow;
				if (remainingHearts <= 0) break;
			}

			return (
				<>
					<CastleIcon sx={{ fontSize: 40, color: 'brown' }} />
					{rows}
				</>
			);
		}

		if (value === 3) {
			return <Inventory2Icon sx={{ fontSize: 40, color: 'goldenrod' }} />;
		}

		return null;
	};

	return (
		<Box
			sx={{
				'width': 80,
				'height': 80,
				'backgroundColor': getColor(),
				'clipPath': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
				'margin': '5px',
				'marginBottom': '-10px',
				'display': 'flex',
				'flexDirection': 'column',
				'justifyContent': 'center',
				'alignItems': 'center',
				'boxShadow': isHighlighted ? `0 0 0 5px ${currentPlayer === 1 ? 'yellow' : 'red'}` : 'px 2px 4px rgba(0, 0, 0, 0.2)',
				'fontWeight': 'bold',
				'color': 'black',
				'transition': 'transform 0.2s ease, box-shadow 0.2s ease',
				'&:hover': {
					transform: 'scale(1.1)',
					boxShadow: isHighlighted ? `0 0 0 10px ${currentPlayer === 1 ? 'yellow' : 'red'}` : '0px 8px 16px rgba(0, 0, 0, 0.4)',
				},
			}}
			onMouseEnter={() => onHover(row, col)}
			onMouseLeave={onLeave}
		>
			{renderIcon() || <Typography variant='body2' sx={{ pointerEvents: 'none' }}></Typography>}
		</Box>
	);
};

export default Hexagon;
