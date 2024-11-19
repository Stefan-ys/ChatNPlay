export interface TopicRequest {
    title: string;
    description: string;
}

export interface TopicResponse {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
}