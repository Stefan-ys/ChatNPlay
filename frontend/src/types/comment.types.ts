import { UserResponse } from "./user.types";


export interface CommentResponse {
    id: number;
    user: UserResponse;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentRequest {
    userId: number;
    chatId: number;
    content: string;
}
