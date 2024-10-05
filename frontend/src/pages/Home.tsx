import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Home: React.FC = () => {
    return (
        <Container maxWidth="md" style={{ padding: '50px 0' }}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <IconButton>
                    <SchoolIcon fontSize="large" color="primary" />
                </IconButton>
                <Typography variant="h4" gutterBottom>
                    Welcome to Quizzard
                </Typography>
                <Typography variant="body1" paragraph>
                    Quizzard is the ultimate platform for quizzes and knowledge sharing. Compete with others, track your progress, and expand your knowledge!
                </Typography>
                <Box>
                    <img src="/images/welcome.png" alt="Welcome" style={{ maxWidth: '100%', marginTop: '20px' }} />
                </Box>
                <Box style={{ marginTop: '30px' }}>
                    <Button
                        component={Link}
                        to="/login"
                        variant="contained"
                        color="primary"
                        startIcon={<LoginIcon />}
                        style={{ marginRight: '10px' }}
                    >
                        Login
                    </Button>
                    <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        color="success"
                        startIcon={<PersonAddIcon />}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Home;
