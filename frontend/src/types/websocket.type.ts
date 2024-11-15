import { CommentResponse } from './comment.type';
import { UserResponse } from './user.type';

export type WebSocketReceivedData = string | number | Set<number> |CommentResponse | UserResponse | UserResponse[];