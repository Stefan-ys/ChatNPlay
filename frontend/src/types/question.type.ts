import { TopicResponse } from "./topic.type";

export interface QuestionRequest {
    id: number;
    topicTitle: string;
    questionText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctAnswer: string;
    saved: boolean; 
}

export interface QuestionResponse extends QuestionRequest {
    topic: TopicResponse;
}
