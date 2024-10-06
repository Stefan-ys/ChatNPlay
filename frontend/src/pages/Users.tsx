import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { List, ListItem, Typography, Container, Paper, Box } from '@mui/material';
import UserAvatar from '../components/UserAvatar';

interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    online: boolean;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
            } catch (error: any) {
                console.error('Error fetching users:', error.message);
            }
        };

        fetchUsers();
    }, []);

    return (
        <Container>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>All Users</Typography>
                <List>
                    {users.map((user) => (
                        <ListItem key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <UserAvatar avatarUrl={user.avatarUrl} isOnline={user.online} />
                            <Box ml={2}>
                                <Typography>{user.username}</Typography>
                                <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Users;
