import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    
    const handleSubmit = async () => {
        try {
            await register({username, email, password, confirmPassword});
            setError(null);
        } catch (err) {
            setError('Registration failed. Please check your details.');
        }
    };

    return (
        <Grid container justifyContent="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Register
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px' }}
                    >
                        Register
                    </Button>
                    {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default RegisterPage;
