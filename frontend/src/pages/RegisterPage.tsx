import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { register } from '../services/auth.service';

const RegisterPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await register({ username, email, password, confirmPassword });
		} catch (err) {
			if (Array.isArray(err)) {
				setError(err.map((x) => '* ' + x + ' *'));
			} else {
				setError(['Registration failed. Please check your details.']);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Grid container justifyContent='center' style={{ minHeight: '100vh' }}>
			<Grid item xs={12} sm={8} md={5}>
				<Paper elevation={3} style={{ padding: '20px' }}>
					<Typography variant='h5' gutterBottom>
						Register
					</Typography>
					<TextField fullWidth margin='normal' label='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
					<TextField fullWidth margin='normal' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
					<TextField
						fullWidth
						margin='normal'
						label='Password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='Confirm Password'
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<Button fullWidth variant='contained' color='success' onClick={handleSubmit} disabled={isLoading} style={{ marginTop: '20px' }}>
						{isLoading ? <CircularProgress size={24} color='inherit' /> : 'Register'}
					</Button>
					{error && (
						<Alert severity='error' style={{ marginTop: '20px' }}>
							{error.map((err, index) => (
								<div key={index}>{err}</div>
							))}
						</Alert>
					)}
				</Paper>
			</Grid>
		</Grid>
	);
};

export default RegisterPage;
