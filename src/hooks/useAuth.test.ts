import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from './useAuth';
import * as userApi from '../services/userApi';
import { authService } from '../services/authService';

// Mock TanStack Router navigation
vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
}));

// Mock the userApi
vi.mock('../services/userApi', () => ({
    validateUser: vi.fn(),
}));

// Mock authService
vi.mock('../services/authService', () => ({
    authService: {
        getToken: vi.fn(),
        setToken: vi.fn(),
        removeToken: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: vi.fn(),
    },
}));

const mockValidateUser = vi.mocked(userApi.validateUser);
const mockAuthService = vi.mocked(authService);
const mockNavigate = vi.fn();

// Import after mocking
import { useNavigate } from '@tanstack/react-router';
const mockUseNavigate = vi.mocked(useNavigate);

// Create a wrapper with QueryClient for testing
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useAuth', () => {
    beforeEach(() => {
        mockValidateUser.mockClear();
        mockAuthService.getToken.mockClear();
        mockAuthService.setToken.mockClear();
        mockAuthService.removeToken.mockClear();
        mockAuthService.logout.mockClear();
        mockAuthService.isAuthenticated.mockClear();
        mockNavigate.mockClear();
        mockUseNavigate.mockReturnValue(mockNavigate);
        vi.clearAllMocks();
    });

    it('initializes with unauthenticated state when no token', () => {
        mockAuthService.getToken.mockReturnValue(null);

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('validates token and sets authenticated when token exists and is valid', async () => {
        const mockToken = 'valid-token';
        mockAuthService.getToken.mockReturnValue(mockToken);
        mockValidateUser.mockResolvedValue(undefined);

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // Initially loading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for validation to complete and effects to run
        await act(async () => {
            await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
        });

        await act(async () => {
            await vi.waitFor(() => expect(result.current.isAuthenticated).toBe(true));
        });

        expect(mockValidateUser).toHaveBeenCalledWith(mockToken);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('removes token and sets unauthenticated when token validation fails', async () => {
        const mockToken = 'invalid-token';
        mockAuthService.getToken.mockReturnValue(mockToken);
        mockValidateUser.mockRejectedValue(new Error('Invalid token'));

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // Wait for validation to complete and error to be set
        await act(async () => {
            await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
        });

        await act(async () => {
            await vi.waitFor(() => expect(result.current.error).toBe('Invalid token'));
        });

        expect(mockValidateUser).toHaveBeenCalledWith(mockToken);
        expect(mockAuthService.removeToken).toHaveBeenCalled();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.error).toBe('Invalid token');
    });

    it('calls authService.logout and sets unauthenticated on logout', () => {
        mockAuthService.getToken.mockReturnValue('some-token');
        mockValidateUser.mockResolvedValue();

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.logout();
        });

        expect(mockAuthService.logout).toHaveBeenCalled();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('navigates to login page on logout', () => {
        mockAuthService.getToken.mockReturnValue('some-token');
        mockValidateUser.mockResolvedValue();

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.logout();
        });

        expect(mockAuthService.logout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('does not run validation query when no token exists', () => {
        mockAuthService.getToken.mockReturnValue(null);

        renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(mockValidateUser).not.toHaveBeenCalled();
    });

    it('sets authenticated to false immediately when no token', () => {
        mockAuthService.getToken.mockReturnValue(null);

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });
});
