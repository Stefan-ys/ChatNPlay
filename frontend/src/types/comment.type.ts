import { UserResponse } from './user.type';


export interface CommentResponse {
    id: number;
    user: UserResponse;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    type: 'ADD' | 'EDIT' | 'DELETE';
}

export interface CommentRequest {
    id: number;
    chatId: number;
    userId: number;
    content: string;
}
