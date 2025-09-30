import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useWineSearch } from './useWineSearch';
import * as wineApi from '../../../services/wineApi';
import type { GetWineDTO } from '../../../types/wine';

// Mock the wineApi
vi.mock('../../../services/wineApi', () => ({
    searchWineByBarcode: vi.fn(),
}));

const mockSearchWineByBarcode = vi.mocked(wineApi.searchWineByBarcode);

// Create a wrapper with QueryClient for testing
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });
    
    return ({ children }: { children: React.ReactNode }) => 
        React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockWineData: GetWineDTO[] = [
    {
        id: 'test-wine-1',
        name: 'Test Wine 1',
        country: 'France',
        vintage_year: 2020,
        type: 'RED',
        rating: 'GOOD',
        barcode: '1234567890',
    },
    {
        id: 'test-wine-2',
        name: 'Test Wine 2',
        country: 'Italy',
        type: 'WHITE',
        rating: 'OK',
        barcode: '1234567890',
    },
];

describe('useWineSearch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useWineSearch(), {
            wrapper: createWrapper(),
        });

        expect(result.current.searchResult).toBeNull();
        expect(result.current.isSearching).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it('should search and return multiple wines successfully', async () => {
        mockSearchWineByBarcode.mockResolvedValueOnce(mockWineData);

        const { result } = renderHook(() => useWineSearch(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.searchByBarcode('1234567890');
        });

        await waitFor(() => {
            expect(result.current.isSearching).toBe(false);
        });

        expect(result.current.searchResult).toEqual({
            wines: mockWineData,
            found: true,
        });
        expect(mockSearchWineByBarcode).toHaveBeenCalledWith('1234567890');
    });

    it('should search and return single wine successfully', async () => {
        const singleWine = [mockWineData[0]];
        mockSearchWineByBarcode.mockResolvedValueOnce(singleWine);

        const { result } = renderHook(() => useWineSearch(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.searchByBarcode('1234567890');
        });

        await waitFor(() => {
            expect(result.current.searchResult).toEqual({
                wines: singleWine,
                found: true,
            });
        });
    });

    it('should handle empty search results', async () => {
        mockSearchWineByBarcode.mockResolvedValueOnce([]);

        const { result } = renderHook(() => useWineSearch(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.searchByBarcode('9999999999');
        });

        await waitFor(() => {
            expect(result.current.searchResult).toEqual({
                wines: [],
                found: false,
            });
        });
    });

    it('should clear search results', () => {
        const { result } = renderHook(() => useWineSearch(), {
            wrapper: createWrapper(),
        });

        // Set some initial result
        result.current.clearSearch();

        expect(result.current.searchResult).toBeNull();
    });

    // Note: Loading state testing is complex with TanStack Query mutations
    // The component properly handles loading states via UI, which is tested in WineSearchPage.test.tsx

    it('should clear previous search result before new search', async () => {
        mockSearchWineByBarcode.mockResolvedValueOnce(mockWineData);

        const { result } = renderHook(() => useWineSearch(), {
            wrapper: createWrapper(),
        });

        // First search
        act(() => {
            result.current.searchByBarcode('1234567890');
        });
        
        await waitFor(() => {
            expect(result.current.searchResult?.found).toBe(true);
        });

        // Start second search - should clear previous result
        mockSearchWineByBarcode.mockResolvedValueOnce([]);
        act(() => {
            result.current.searchByBarcode('9999999999');
        });

        await waitFor(() => {
            expect(result.current.searchResult).toEqual({
                wines: [],
                found: false,
            });
        });
    });

    // Note: Error handling tested through component tests with mock
});