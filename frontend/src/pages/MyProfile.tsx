import React, { useState, useEffect } from 'react';
import { getUserProfile, updateAvatar } from '../services/userService';
import { Button, Container, TextField, Avatar, Typography, Box, Paper } from '@mui/material';

const MyProfile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [avatar, setAvatar] = useState<File | null>(null);

    const userId = 1; 

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getUserProfile(userId);
                setUser(userProfile);
            } catch (error: any) {
                console.error('Error fetching profile:', error.message);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleAvatarUpload = async () => {
        if (avatar) {
            try {
                await updateAvatar(userId, avatar);
                alert('Avatar updated successfully!');
            } catch (error: any) {
                console.error('Error updating avatar:', error.message);
            }
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <Container>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>My Profile</Typography>
                <TextField
                    fullWidth
                    label="Username"
                    value={user.username}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={user.email}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                />
                <Box display="flex" alignItems="center" marginTop="20px">
                    <Avatar src={user.avatarUrl} alt="avatar" sx={{ width: 100, height: 100 }} />
                    <input type="file" onChange={handleAvatarChange} style={{ marginLeft: '20px' }} />
                </Box>
                <Button variant="contained" color="primary" onClick={handleAvatarUpload} style={{ marginTop: '20px' }}>
                    Upload Avatar
                </Button>
            </Paper>
        </Container>
    );
};

export default MyProfile;
