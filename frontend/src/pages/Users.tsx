import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { List, Header, Container } from 'semantic-ui-react';

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
            <Header as="h2">All Users</Header>
            <List divided relaxed>
                {users.map((user: any) => (
                    <List.Item key={user.id}>
                        <List.Content>
                            <List.Header>{user.username}</List.Header>
                            <List.Description>{user.email}</List.Description>
                            <List.Description>Role: {user.role}</List.Description>
                            <List.Description>Score: {user.score}</List.Description>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </Container>
    );
};

export default Users;
