import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('gw_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('gw_token'));
    const [loading, setLoading] = useState(false);

    const saveAuth = (userData, tokenStr) => {
        setUser(userData);
        setToken(tokenStr);
        localStorage.setItem('gw_user', JSON.stringify(userData));
        localStorage.setItem('gw_token', tokenStr);
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authAPI.login({ email, password });
            saveAuth(data.user, data.token);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const data = await authAPI.register({ name, email, password });
            saveAuth(data.user, data.token);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('gw_user');
        localStorage.removeItem('gw_token');
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
