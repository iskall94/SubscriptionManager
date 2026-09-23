import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('accessToken');
    });

    const login = (newToken: string) => {
        localStorage.setItem('accessToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setToken(null);
    }

    return (
        <AuthContext.Provider 
            value={{ 
                token, 
                login, 
                logout, 
                isAuthenticated: !!token 
            }}>
            {children}
        </AuthContext.Provider>
    );
}