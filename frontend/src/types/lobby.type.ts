import { CommentResponse } from "./comment.type";
import { UserResponse } from "./user.type";

export interface LobbyResponse {
    id: number;
    name: string;
    chat: CommentResponse[];
    users: UserResponse[];
}