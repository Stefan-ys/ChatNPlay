import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { SOCKET_URL } from '../common/urls';



let client: Client | null = null;

export const connectWebSocket = (onMessage: (msg: any) => void) => {
    client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        onConnect: () => {
            client?.subscribe('/topic/lobby', (message) => {
                const data = JSON.parse(message.body);
                onMessage(data);
            });
        },
        onStompError: (error) => {
            console.error('Error:', error);
        },
    });

    client.activate();
};

export const disconnectWebSocket = () => {
    client?.deactivate();
};
