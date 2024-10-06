import { createContext, useState, ReactNode } from "react";
import { login, logout, register } from '../services/authServices';
import axios from 'axios';

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    role: string;
    score: number;
    isOnline: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = JSON.parse(atob(base64));
                return {
                    id: decodedPayload.id || 0,
                    username: decodedPayload.sub,
                    email: decodedPayload.email || "",
                    avatarUrl: decodedPayload.avatarUrl || "",
                    role: decodedPayload.role || "",
                    score: decodedPayload.score || 0
                };
            } catch (error) {
                console.error("Token parsing error:", error);
                return null;
            }
        }
        return null;
    });

    const handleLogin = async (username: string, password: string) => {
        const response = await login(username, password);
        const { token, user } = response;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
    };

    const handleRegister = async (username: string, email: string, password: string, confirmPassword: string) => {
        const response = await register(username, email, password, confirmPassword);
        handleLogin(username, password);
    };

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login: handleLogin, register: handleRegister, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
