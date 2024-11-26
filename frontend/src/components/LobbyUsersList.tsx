import React from 'react';
import { UserLobbyResponse } from '../types/user.type';
import { List, ListItem, ListItemText, Typography, Avatar, Box, Chip } from '@mui/material';

interface LobbyUsersListProps {
	users: UserLobbyResponse[];
}

const LobbyUsersList: React.FC<LobbyUsersListProps> = ({ users }) => {
	return (
		<Box
			sx={{
				maxHeight: '500px',
				overflowY: 'auto',
				borderRadius: 3,
				border: '1px solid #ddd',
				padding: 2,
				boxShadow: 3,
				backgroundColor: '#f5f5f5',
			}}
		>
			<Typography variant='h6' gutterBottom>
				Users in Lobby
			</Typography>
			<List>
				{users.length > 0 ? (
					users.map((user) => (
						<ListItem
							key={user.id}
							sx={{
								display: 'flex',
								alignItems: 'center',
								mb: 1,
							}}
						>
							<Avatar src={user.avatarUrl} sx={{ mr: 2, width: 40, height: 40 }} />
							<ListItemText
								primary={user.username}
								secondary={
									user.ready ? <Chip label='Ready' color='success' size='small' /> : <Chip label='Idle' color='info' size='small' />
								}
							/>
						</ListItem>
					))
				) : (
					<Typography variant='body2'>No users in this lobby.</Typography>
				)}
			</List>
		</Box>
	);
};

export default LobbyUsersList;
