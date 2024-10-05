import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { List, Typography, Container, Paper } from '@mui/material';

const Users: React.FC = () => {
    const [users, setUsers] = useState([]);

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
                    {users.map((user: any) => (
                        <Typography key={user.id}>
                            {user.username} - {user.email}
                        </Typography>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Users;
