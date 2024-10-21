import React from 'react';
import { UserResponse } from '../types/user.type';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

interface UserListProps {
  users: UserResponse[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Users in Lobby</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.username} />
              {user.isOnline ? (
                <Chip label="Online" color="success" size="small" />
              ) : (
                <Chip label="Offline" color="default" size="small" />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserList;
