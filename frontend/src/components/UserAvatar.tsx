import React from 'react';
import { Avatar, Badge, styled } from '@mui/material';
import { useUserStatus } from '../context/UserStatusProvider';

interface UserAvatarProps {
	avatarUrl: string;
	userId: string;
}

const StatusBadge = styled(Badge)(({ theme }) => ({
	'&.MuiBadge-badge': {
		backgroundColor: 'transparent',
		with: 12,
		Height: 12,
		borderRadius: '50%',
		border: `2px solid ${theme.palette.background.paper}`,
	},
}));

const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, userId }) => {
	const { onlineUsers } = useUserStatus();

	return (
		<StatusBadge
			overlap='circular'
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			badgeContent=''
			sx={{
				'& .MuiBadge-badge': {
					backgroundColor: onlineUsers.has(userId) ? 'green' : 'red',
				},
			}}
		>
			<Avatar
				src={avatarUrl}
				alt='User Avatar'
				sx={{ width: 40, height: 40 }}
			/>
		</StatusBadge>
	);
};

export default UserAvatar;
