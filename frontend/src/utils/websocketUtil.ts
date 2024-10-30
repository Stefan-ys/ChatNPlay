import Stomp from 'stompjs';
import { WebSocketReceivedData } from '../types/websocket.type';

interface StompClient {
    connect: (headers: object, onConnect: () => void, onError: (error: any) => void) => void;
    subscribe: (destination: string, callback: (message: any) => void) => void;
    send: (destination: string, headers: object, body: string) => void;
    disconnect: (callback: () => void) => void;
}

export const createWebSocketClient = (
    topic: string,
    onMessage: (data: WebSocketReceivedData) => void,
    onError: (error: { message: string }) => void
): StompClient => {
    const accessToken = localStorage.getItem('accessToken');
    const socketUrl = 'ws://localhost:8080/ws';
    const client = Stomp.client(socketUrl);

    client.connect(
        {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        () => {
            client.subscribe(topic, (message) => {
                const receivedData: WebSocketReceivedData = JSON.parse(message.body);
                onMessage(receivedData);
            });
        },
        (error) => {
            const errorMessage = typeof error === 'string' ? error : (error as Stomp.Frame).headers.message || 'Unknown error occurred.';
            onError({ message: errorMessage });
        }
    );

    return client;
};
