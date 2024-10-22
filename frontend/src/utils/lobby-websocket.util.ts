import { Client, StompSubscription } from '@stomp/stompjs';
import { CommentResponse } from '../types/comment.type';

export const createLobbyWebSocket = (
    lobbyId: number,
    onMessageReceived: (comment: CommentResponse | string) => void,
    onConnectCallback?: () => void,
    onErrorCallback?: (error: string) => void
) => {
    const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',  
        onConnect: () => {
            console.log('Connected to WebSocket');
            if (onConnectCallback) onConnectCallback();

            client.subscribe(`/topic/lobby/${lobbyId}/chat`, (message) => {
                const comment: CommentResponse | string = JSON.parse(message.body);
                console.log('Received WebSocket message:', comment);
                onMessageReceived(comment);
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            if (onErrorCallback) onErrorCallback(frame.headers['message']);
        },
        debug: (str) => {
            console.log('STOMP Debug:', str);
        }
    });

    client.activate();  

    return client;
};

export const closeLobbyWebSocket = (client: Client) => {
    if (client && client.active) {
        client.deactivate();
        console.log('WebSocket connection closed');
    }
};
