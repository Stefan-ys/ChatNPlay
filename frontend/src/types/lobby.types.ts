import { UserResponse } from "./user.types";
import { ChatResponse } from "./chat.types";

export interface LobbyResponse {
    id: number;
    name: string;
    chat: ChatResponse;
    users: UserResponse[];
}