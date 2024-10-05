import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { user } = useAuth();

    return (
        <AppBar position="fixed">
            <Container>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                    </Typography>

                    <Button color="inherit">
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                    </Button>
                    <Button color="inherit">
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                    </Button>
                    <Button color="inherit">
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
                    </Button>

                    {user && (
                        <Typography variant="h6" component="div" sx={{ marginLeft: 'auto' }}>
                            Welcome, {user.username}!
                        </Typography>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
