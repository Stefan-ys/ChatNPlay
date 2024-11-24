export interface UserResponse {
    id: number;
    avatarUrl: string;
    username: string;
    email: string;
    role: string;
    score: number;
    isOnline: boolean;
}

export interface UserLobbyResponse extends UserResponse{
    isReady: boolean;
}