import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';


const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async () => {
        try {
            await login({username, password});
            setError(null);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Grid container justifyContent="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8} md={5}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Login
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
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px' }}
                    >
                        Login
                    </Button>
                    {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LoginPage;
