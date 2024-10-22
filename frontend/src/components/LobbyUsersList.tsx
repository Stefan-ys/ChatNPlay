import React from 'react';
import { UserResponse } from '../types/user.type';
import { List, ListItem, ListItemText, Typography } from '@mui/material';


interface LobbyUsersListProps {
    users: UserResponse[];
}

const LobbyUsersList: React.FC<LobbyUsersListProps> = ({ users }) => {
    return (
        <List>
            {users.length > 0 ? (
                users.map((user) => (
                    <ListItem key={user.id}>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))
            ) : (
                <Typography variant="body2">No users in this lobby.</Typography>
            )}
        </List>
    );
};

export default LobbyUsersList;
