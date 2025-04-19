import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setCurrentUser(null);
                } else {
                    setCurrentUser({
                        id: decodedToken.id,
                        username: decodedToken.username,
                        role: decodedToken.role
                    })
                }
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token');
                setToken(null);
                setCurrentUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            setError(null);
            setLoading(true);
            const response = await authService.login(username, password);
            const { token } = response;

            localStorage.setItem('token', token);
            setToken(token);

            const decodedToken = jwtDecode(token);
            setCurrentUser({
                id: decodedToken.id,
                username: decodedToken.username,
                role: decodedToken.role
            });

            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            loading,
            error,
            isAuthenticated: !!currentUser,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}