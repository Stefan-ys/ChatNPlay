import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ToggleFlag from './ToggleFlag';

const Navbar: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/home');
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	return (
		<AppBar position='fixed'>
			<Container>
				<Toolbar>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						<Link to='/' style={{ color: 'white', textDecoration: 'none' }}>
							Home
						</Link>
					</Typography>
					{!user && (
						<>
							<Button color='inherit'>
								<Link
									to='/login'
									style={{
										color: 'white',
										textDecoration: 'none',
									}}
								>
									Login
								</Link>
							</Button>
							<Button color='inherit'>
								<Link
									to='/register'
									style={{
										color: 'white',
										textDecoration: 'none',
									}}
								>
									Register
								</Link>
							</Button>
						</>
					)}

					{user && (
						<>
							<Typography variant='h6' component='div' sx={{ marginLeft: 'auto' }}>
								Welcome, {user.username}!
							</Typography>
							<Button color='inherit'>
								<Link
									to='/users'
									style={{
										color: 'white',
										textDecoration: 'none',
									}}
								>
									Users
								</Link>
							</Button>
							<Button color='inherit'>
								<Link
									to='/profile'
									style={{
										color: 'white',
										textDecoration: 'none',
									}}
								>
									Profile
								</Link>
							</Button>
							<Button color='inherit'>
								<Link
									to='/lobby'
									style={{
										color: 'white',
										textDecoration: 'none',
									}}
								>
									Lobby
								</Link>
							</Button>
							<Button color='inherit'>
								<Link
									to='/quizz-factory'
									style={{
										color: 'white',
										textDecoration: 'none',
									}}
								>
									Quizz Factory
								</Link>
							</Button>
							<Button color='inherit' onClick={handleLogout}>
								Logout
							</Button>
						</>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navbar;
