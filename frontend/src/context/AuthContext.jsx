import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (error) {
            console.error('Initial user fetch failed');
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        const data = res.data;
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const res = await axios.post('/api/auth/register', { name, email, password });
        const data = res.data;
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
