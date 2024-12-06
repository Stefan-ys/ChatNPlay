import Stomp, { Client } from 'stompjs';
import { WebSocketReceivedData } from '../types/websocket.type';
import { WEBSOCKET_URL } from '../common/urls';

interface StompClient {
    connect: (headers: object, onConnect: () => void, onError: (error: any) => void) => void;
    subscribe: (destination: string, callback: (message: any) => void) => void;
    send: (destination: string, headers: object, body: string) => void;
    disconnect: (callback: () => void) => void;
}

export const createWebSocketClient = async (
	topic: string,
	onMessage: (data: WebSocketReceivedData) => void,
	onError: (error: { message: string }) => void
): Promise<StompClient> => {
	const accessToken = localStorage.getItem('accessToken');
	const client = Stomp.client(WEBSOCKET_URL);

	const headers = accessToken ? {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	} : {};

	return new Promise((resolve, reject) => {
		client.connect(
			headers,
			() => {
				client.subscribe(topic, (message) => {
					const receivedData: WebSocketReceivedData = JSON.parse(message.body);
					onMessage(receivedData);
				});
				console.log('WebSocket connected and subscribed to topic.');
				resolve(client);
			},
			(error) => {
				console.error('WebSocket connection error:', error);
				const errorMessage = typeof error === 'string' ? error : (error as Stomp.Frame).headers.message || 'Unknown error occurred.';
				onError({ message: errorMessage });
				reject(new Error(errorMessage));
			}
		);
	});
};
