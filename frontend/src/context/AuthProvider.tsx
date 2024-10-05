import { createContext, useState, ReactNode } from "react";
import { login, logout, register } from '../services/authServices';
import  * as jwt_decode from 'jwt-decode';
import axios from 'axios';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface User {
    username: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwt_decode(token);
            return { username: decodedToken.sub };    
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
        <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
