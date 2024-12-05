import { CommentResponse } from './comment.type';

export interface ChatResponse {
    id: number;
    comments: CommentResponse[];
}