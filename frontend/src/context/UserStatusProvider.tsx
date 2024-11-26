import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createWebSocketClient } from '../utils/websocketUtil';
import { WebSocketReceivedData } from '../types/websocket.type';
import { useAuth } from '../hooks/useAuth';

interface UserStatusContextType {
	onlineUsers: Set<string>;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

const UserStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
	const stompClientRef = useRef<any>(null);
	const { user } = useAuth();

	useEffect(() => {
		const setupWebSocket = async () => {
			const topic = '/topic/user-status';
			try {
				const client = await createWebSocketClient(
					topic,
					(recievedData: WebSocketReceivedData) => {
						setOnlineUsers(new Set(recievedData));
					},
					(error) => {
						console.error('WebSocket connection error:', error.message);
					},
				);

				stompClientRef.current = client;
				handleUserIsOnline();
			} catch (error) {
				console.error('Failed to connect WebSocket:', error);
			}
		};

		setupWebSocket();

		return () => {
			if (stompClientRef.current && stompClientRef.current.connected) {
				handleUserIsOffline();
				stompClientRef.current.disconnect(() => {
					console.log('WebSocket disconnected.');
				});
			}
		};
	}, [user]);

	const handleUserIsOnline = () => {
		if (stompClientRef.current?.connected && user) {
			stompClientRef.current.send('/app/status/online', {}, JSON.stringify(user.id));
		}
	};

	const handleUserIsOffline = () => {
		if (user) {
			stompClientRef.current.send('/app/status/offline', {}, JSON.stringify(user.id));
		}
	};

	return <UserStatusContext.Provider value={{ onlineUsers }}>{children}</UserStatusContext.Provider>;
};

export const useUserStatus = () => {
	const context = useContext(UserStatusContext);
	if (!context) {
		throw new Error('useUserStatus must be used within a UserStatusProvider');
	}
	return context;
};

export { UserStatusProvider };
