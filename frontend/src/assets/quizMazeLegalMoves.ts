export const getLegalMoves = (board: number[][]) => {
	const movesField = board.map((row) => Array(row.length).fill(0));

	const player1Values = new Set([1, 10, 11, 12, 13, 14, 15, 16]);
	const player2Values = new Set([2, 20, 21, 22, 23, 24, 25, 26]);

	const directionsEvenRow = [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]];

	const directionsOddRow = [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];

	const isInBounds = (r: number, c: number) => r >= 0 && r < board.length && c >= 0 && c < board[r].length;

	const isLegalMove = (r: number, c: number, player: number) => {
		if (!isInBounds(r, c)) return false;
		const cellValue = board[r][c];

		return cellValue !== 8 &&
			!(player === 1 ? player1Values.has(cellValue) : player2Values.has(cellValue));
	};

	const markLegalMoves = (startRow: number, startCol: number, player: number) => {
		const directions = startRow % 2 === 0 ? directionsOddRow : directionsEvenRow;

		for (const [dr, dc] of directions) {
			const newRow = startRow + dr;
			const newCol = startCol + dc;

			if (isLegalMove(newRow, newCol, player)) {
				if ((movesField[newRow][newCol] === 1 && player === 2)
							|| (movesField[newRow][newCol] === 2 && player === 1)) {
					movesField[newRow][newCol] = 3;
				} else {
					movesField[newRow][newCol] = player;
				}
			}
		}
	};

	for (let r = 0; r < board.length; r++) {
		for (let c = 0; c < board[r].length; c++) {
			const cellValue = board[r][c];
			if (player1Values.has(cellValue)) {
				markLegalMoves(r, c, 1);
			} else if (player2Values.has(cellValue)) {
				markLegalMoves(r, c, 2);
			}
		}
	}

	return movesField;
};
