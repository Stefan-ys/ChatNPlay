import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/user.service';
import { List, ListItem, Typography, Container, Paper, Box } from '@mui/material';
import UserAvatar from '../components/UserAvatar';
import { UserResponse } from '../types/user.type';

const UsersPage: React.FC = () => {
	const [users, setUsers] = useState<UserResponse[]>([]);

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
				<Typography variant='h5' gutterBottom>
					All Users
				</Typography>
				<List>
					{users.map((user) => (
						<ListItem key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
							<UserAvatar avatarUrl={user.avatarUrl} userId={user.id} />
							<Box ml={2}>
								<Typography>{user.username}</Typography>
								<Typography variant='body2' color='textSecondary'>
									{user.email}
								</Typography>
							</Box>
						</ListItem>
					))}
				</List>
			</Paper>
		</Container>
	);
};

export default UsersPage;
