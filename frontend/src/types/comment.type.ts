import { UserResponse } from "./user.type";


export interface CommentResponse {
    id: number;
    user: UserResponse;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentRequest {
    userId: number;
    lobbyId: number;
    content: string;
}
