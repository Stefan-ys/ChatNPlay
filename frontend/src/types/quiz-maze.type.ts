export interface QuizMazePlayerResponse{
    id: number;
    playerNumber: number;
    avatarUrl: string;
    rank: string;
    username: string;
    gameScore: number;
    perks: QuizMazePerkResponse[];
}

export interface QuizMazeGamesResponse{
    id: string;
    title: string;
    version: string;
    description: string;
    rules: string;
    timeToAnswer: number;
    totalMovesAllowed: number;
    timeToMove: number;
    player1: QuizMazePlayerResponse;
    player2: QuizMazePlayerResponse;
    isPlayer1Turn: boolean;
    moves: number;
    field: number[][];
}

export interface QuizMazeGameResponseInit {
    field: string[];
    id: string;
    title: string;
    version: string;
    description: string;
    rules: string;
    timeToAnswer: number;
    totalMovesAllowed: number;
    timeToMove: number;
    player1: QuizMazePlayerResponse;
    player2: QuizMazePlayerResponse;
    isPlayer1Turn: boolean;
    moves: number;
}

export interface QuizMazeGamesResponseLight{
    id: string;
    player1: QuizMazePlayerResponse;
    player2: QuizMazePlayerResponse;
    isPlayer1Turn: boolean;
    moves: number;
    field: number[][];
}

export interface QuizMazePerkResponse {
    name: string;
    description: string;
}