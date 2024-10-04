import React, { useState, useEffect } from 'react';
import { getUserProfile, updateAvatar } from '../services/userService';
import { Button, Container, Form, Image, Header } from 'semantic-ui-react';

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
            <Header as="h2">My Profile</Header>
            <Form>
                <Form.Field>
                    <label>Username</label>
                    <input value={user.username} readOnly />
                </Form.Field>
                <Form.Field>
                    <label>Email</label>
                    <input value={user.email} readOnly />
                </Form.Field>
                <Form.Field>
                    <label>Avatar</label>
                    <Image src={user.avatarUrl} size="small" />
                    <input type="file" onChange={handleAvatarChange} />
                </Form.Field>
                <Button type="button" onClick={handleAvatarUpload}>
                    Upload Avatar
                </Button>
            </Form>
        </Container>
    );
};

export default MyProfile;
