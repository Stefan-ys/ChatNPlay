import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { updateAvatar } from '../services/user.service';
import { Button, Container, TextField, Avatar, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';

const MyProfilePage: React.FC = () => {
	const { user, setUser } = useContext(AuthContext) ?? {};
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];
			setAvatar(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleAvatarUpload = async () => {
		if (avatar && user) {
			setIsLoading(true);
			setError(null);
			try {
				const updatedUser = await updateAvatar(user.id, avatar);
				alert('Avatar updated successfully!');
				setUser && setUser(updatedUser);
			} catch (error: any) {
				console.error('Error updating avatar:', error.message);
				setError('Failed to upload avatar. Please try again.');
			} finally {
				setIsLoading(false);
			}
		}
	};

	if (!user) return <p>Loading...</p>;

	return (
		<Container>
			<Paper elevation={3} style={{ padding: '20px' }}>
				<Typography variant='h5' gutterBottom>
					My Profile
				</Typography>
				<TextField fullWidth label='Username' value={user.username} InputProps={{ readOnly: true }} margin='normal' />
				<TextField fullWidth label='Email' value={user.email} InputProps={{ readOnly: true }} margin='normal' />
				<Box display='flex' alignItems='center' marginTop='20px'>
					<Avatar src={avatarPreview || user.avatarUrl} alt='avatar' sx={{ width: 100, height: 100 }} />
					<input type='file' onChange={handleAvatarChange} style={{ marginLeft: '20px' }} />
				</Box>
				<Button variant='contained' color='primary' onClick={handleAvatarUpload} style={{ marginTop: '20px' }} disabled={isLoading}>
					{isLoading ? <CircularProgress size={24} color='inherit' /> : 'Upload Avatar'}
				</Button>
				{error && (
					<Alert severity='error' style={{ marginTop: '20px' }}>
						{error}
					</Alert>
				)}
			</Paper>
		</Container>
	);
};

export default MyProfilePage;
