import { SOCKET_URL } from "../common/urls";

type StatusUpdateCallback = (userId: number, isOnline: boolean) => void;

export class UserStatusWebSocket {
    private socket: WebSocket | null = null;

    initWebSocket(statusUpdateCallback: StatusUpdateCallback) {
        this.socket = new WebSocket(SOCKET_URL); 
        
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            const userStatusUpdate = JSON.parse(event.data);
            const { userId, isOnline } = userStatusUpdate;
            statusUpdateCallback(userId, isOnline);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    closeWebSocket() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const userStatusWebSocket = new UserStatusWebSocket();
