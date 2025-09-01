import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { validateUser } from '../services/userApi';

export interface UseAuthReturn {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = authService.getToken();

    const { isLoading, error, isSuccess, isError } = useQuery({
        queryKey: ['validateUser'],
        queryFn: async () => {
            if (!token) {
                throw new Error('No token found');
            }
            await validateUser(token);
            return true;
        },
        enabled: !!token, // Only run query if token exists
        retry: false,
    });

    useEffect(() => {
        if (isSuccess) {
            setIsAuthenticated(true);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            // Token is invalid, clean up
            authService.removeToken();
            setIsAuthenticated(false);
        }
    }, [isError]);

    useEffect(() => {
        // If no token, immediately set as unauthenticated
        if (!token) {
            setIsAuthenticated(false);
        }
    }, [token]);

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        isLoading,
        error: error?.message || null,
        logout,
    };
};