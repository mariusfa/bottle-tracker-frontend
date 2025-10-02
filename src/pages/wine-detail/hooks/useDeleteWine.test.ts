import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useDeleteWine } from './useDeleteWine';
import * as wineApi from '../../../services/wineApi';

// Mock TanStack Router navigation
vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
}));

// Mock the wineApi
vi.mock('../../../services/wineApi', () => ({
    deleteWine: vi.fn(),
}));

const mockDeleteWineApi = vi.mocked(wineApi.deleteWine);
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

describe('useDeleteWine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    it('returns initial state', () => {
        mockDeleteWineApi.mockResolvedValue();

        const { result } = renderHook(() => useDeleteWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isDeleting).toBe(false);
        expect(result.current.error).toBeNull();
        expect(typeof result.current.deleteWine).toBe('function');
    });

    it('successfully deletes wine and navigates', async () => {
        mockDeleteWineApi.mockResolvedValue();

        const { result } = renderHook(() => useDeleteWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.deleteWine();
        });

        await waitFor(() => {
            expect(result.current.isDeleting).toBe(false);
        });

        expect(mockDeleteWineApi).toHaveBeenCalledWith('test-wine-id');
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/wines' });
    });

    it('sets error when deletion fails', async () => {
        const errorMessage = 'Failed to delete wine';
        mockDeleteWineApi.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useDeleteWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.deleteWine();
        });

        await waitFor(() => {
            expect(result.current.isDeleting).toBe(false);
        });

        expect(result.current.error).toBe(errorMessage);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('calls API with correct wine ID', async () => {
        mockDeleteWineApi.mockResolvedValue();

        const { result } = renderHook(() => useDeleteWine('specific-wine-id'), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.deleteWine();
        });

        await waitFor(() => {
            expect(result.current.isDeleting).toBe(false);
        });

        expect(mockDeleteWineApi).toHaveBeenCalledWith('specific-wine-id');
    });
});
