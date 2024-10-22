import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { Button } from '@mui/material';

const ToggleFlag: React.FC = () => {
    const [client, setClient] = useState<any>(null);
    const [toggleStatus, setToggleStatus] = useState<boolean>(false);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/topic/toggleStatus', (message) => {
                    setToggleStatus(JSON.parse(message.body));
                });
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const handleToggle = () => {
        if (client) {
            client.publish({
                destination: '/app/toggle',
            });
        }
    };

    return (
        <Button color="inherit" onClick={handleToggle}>
            Toggle Flag: {toggleStatus ? 'On' : 'Off'}
        </Button>
    );
};

export default ToggleFlag;
