import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useWineDetail } from './useWineDetail';
import * as wineApi from '../../../services/wineApi';
import type { GetWineDTO } from '../../../types/wine';

// Mock the wineApi
vi.mock('../../../services/wineApi', () => ({
    getWineById: vi.fn(),
}));

const mockGetWineById = vi.mocked(wineApi.getWineById);

// Create a wrapper with QueryClient for testing
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    
    return ({ children }: { children: React.ReactNode }) => 
        React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockWineData: GetWineDTO = {
    id: 'test-wine-id',
    name: 'Test Wine',
    country: 'France',
    vintage_year: 2020,
    type: 'RED',
    rating: 'GOOD',
    barcode: '1234567890',
};

describe('useWineDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return loading state initially', () => {
        mockGetWineById.mockImplementation(() => new Promise(() => {})); // Never resolves
        
        const { result } = renderHook(() => useWineDetail('test-wine-id'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.wine).toBeUndefined();
        expect(result.current.error).toBeNull();
    });

    it('should fetch and return wine data successfully', async () => {
        mockGetWineById.mockResolvedValueOnce(mockWineData);

        const { result } = renderHook(() => useWineDetail('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.wine).toEqual(mockWineData);
        expect(result.current.error).toBeNull();
        expect(mockGetWineById).toHaveBeenCalledWith('test-wine-id');
    });

    // Note: Error handling is tested in the component tests by mocking the hook directly

    it('should not make API call when wineId is empty', () => {
        const { result } = renderHook(() => useWineDetail(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.wine).toBeUndefined();
        expect(result.current.error).toBeNull();
        expect(mockGetWineById).not.toHaveBeenCalled();
    });

    it('should not make API call when wineId is undefined', () => {
        const { result } = renderHook(() => useWineDetail(undefined as any), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.wine).toBeUndefined();
        expect(result.current.error).toBeNull();
        expect(mockGetWineById).not.toHaveBeenCalled();
    });

    it('should refetch when wineId changes', async () => {
        const secondWineData: GetWineDTO = {
            ...mockWineData,
            id: 'second-wine-id',
            name: 'Second Wine',
        };

        mockGetWineById
            .mockResolvedValueOnce(mockWineData)
            .mockResolvedValueOnce(secondWineData);

        const { result, rerender } = renderHook(
            ({ wineId }) => useWineDetail(wineId),
            {
                wrapper: createWrapper(),
                initialProps: { wineId: 'test-wine-id' },
            }
        );

        await waitFor(() => {
            expect(result.current.wine).toEqual(mockWineData);
        });

        rerender({ wineId: 'second-wine-id' });

        await waitFor(() => {
            expect(result.current.wine).toEqual(secondWineData);
        });

        expect(mockGetWineById).toHaveBeenCalledTimes(2);
        expect(mockGetWineById).toHaveBeenNthCalledWith(1, 'test-wine-id');
        expect(mockGetWineById).toHaveBeenNthCalledWith(2, 'second-wine-id');
    });
});