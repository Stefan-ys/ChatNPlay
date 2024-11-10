import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import Stomp from 'stompjs';

const ToggleFlag: React.FC = () => {
	const [toggleStatus, setToggleStatus] = useState<boolean>(false);
	const [stompClient, setStompClient] = useState<any>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		const socketUrl = `ws://localhost:8080/ws`;
		const client = Stomp.client(socketUrl);

		client.connect(
			{
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			() => {
				setIsConnected(true);

				client.subscribe('/topic/toggleStatus', (message) => {
					const receivedValue = JSON.parse(message.body);
					setToggleStatus(receivedValue);
				});
			},
			(error) => {
				console.error('WebSocket connection error:', error);
			},
		);

		setStompClient(client);

		return () => {
			if (client && client.connected) {
				client.disconnect(() => {
					console.log('Disconnected from WebSocket');
					setIsConnected(false);
				});
			}
		};
	}, []);

	const handleToggle = () => {
		if (stompClient && isConnected) {
			stompClient.send('/app/toggle', {}, JSON.stringify(toggleStatus));
		}
	};

	return (
		<Button color='inherit' onClick={handleToggle}>
			Toggle Flag: {toggleStatus ? 'On' : 'Off'}
		</Button>
	);
};

export default ToggleFlag;
