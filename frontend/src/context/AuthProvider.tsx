import { createContext, useState, ReactNode } from 'react';
import { UserResponse } from '../types/user.type';
import { login, logout, register } from '../services/auth.service';
import axios from 'axios';
import { LoginRequest, RegisterRequest } from '../types/auth.type';

interface AuthContextType {
	user: UserResponse | null;
	setUser: React.Dispatch<React.SetStateAction<UserResponse | null>>;
	login: (loginData: LoginRequest) => Promise<void>;
	register: (registerData: RegisterRequest) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserResponse | null>(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			return JSON.parse(storedUser);
		}

		const token = localStorage.getItem('accessToken');
		if (token) {
			try {
				const base64Url = token.split('.')[1];
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
				const decodedPayload = JSON.parse(atob(base64));
				return {
					id: decodedPayload.id || 0,
					username: decodedPayload.sub,
					email: decodedPayload.email || '',
					avatarUrl: decodedPayload.avatarUrl || '',
					role: decodedPayload.role || '',
					score: decodedPayload.score || 0,
				};
			} catch (error) {
				console.error('Token parsing error:', error);
				return null;
			}
		}
		return null;
	});

	const handleLogin = async (loginData: LoginRequest) => {
		const response = await login(loginData);
		const { token, refreshToken, user } = response;
		localStorage.setItem('accessToken', token);
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('user', JSON.stringify(user));
		axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		setUser(user);
	};

	const handleRegister = async (registerData: RegisterRequest) => {
		try {
			await register(registerData);
			await handleLogin({
				username: registerData.username,
				password: registerData.password,
			});
		} catch (error) {
			console.error('Registration failed:', error);
			throw error;
		}
	};

	const handleLogout = async () => {
		await logout();
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('user');
		delete axios.defaults.headers.common.Authorization;
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				login: handleLogin,
				register: handleRegister,
				logout: handleLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
