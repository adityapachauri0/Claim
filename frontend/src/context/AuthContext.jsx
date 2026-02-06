import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    const API_BASE_URL = 'http://localhost:5001/api';

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // In a real app, we might have a /me endpoint
                // For now, we'll assume the token is valid if it exists
                // and we'll decode it or just use the stored user info
                const storedUser = localStorage.getItem('adminUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);

            localStorage.setItem('adminToken', newToken);
            localStorage.setItem('adminUser', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
    };

    const authFetch = async (url, options = {}) => {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        return fetch(url, { ...options, headers });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
};
