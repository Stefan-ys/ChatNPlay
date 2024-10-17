import { SOCKET_URL } from './../common/urls';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


export const createLobbyUpdateWebSocket  = (lobbyId: number, onMessage: (message: any) => void) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        onConnect: () => {
            client.subscribe(`/topic/lobbies/${lobbyId}`, (message) => {
                const lobbyData = JSON.parse(message.body);
                onMessage(lobbyData);
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
    });

    client.activate();

    return client;
}