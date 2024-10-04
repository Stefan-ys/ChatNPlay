import { createContext, useState, ReactNode } from "react";
import { login, logout, register } from '../services/authServices';


interface AuthContextType {
    user: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);

    const handleLogin = async (username: string, password: string) => {
        const data = await login(username, password);
        setUser(data.user);
    };

    const handleRegister = async (username: string, email: string, password: string, confirmPassword: string) => {
        const data = await register(username, email, password, confirmPassword);
        setUser(data.user);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login: handleLogin, register: handleRegister, logout: handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}