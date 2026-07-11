import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'entrepreneur' | 'investor' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    register: (userData: object) => Promise<void>;
    login: (credentials: object) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    // Matched to your GET /api/auth/profile endpoint
                    const { data } = await API.get('/api/auth/profile'); 
                    setUser(data.user); // Extracts user from your custom response format
                } catch (error) {
                    console.error("Session expired or invalid token");
                    logout();
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, [token]);

    const register = async (userData: object) => {
        try {
            const { data } = await API.post('/api/auth/register', userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const login = async (credentials: object) => {
        try {
            const { data } = await API.post('/api/auth/login', credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};