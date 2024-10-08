import { CommentResponse } from "./comment.types";


export interface ChatResponse {
    id: number;
    comments: CommentResponse[];
}