import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useWineCollection } from './useWineCollection';
import { getAllUserWines } from '../../../services/wineApi';
import type { GetWineDTO } from '../../../types/wine';

vi.mock('../../../services/wineApi', () => ({
    getAllUserWines: vi.fn(),
}));

const mockGetAllUserWines = vi.mocked(getAllUserWines);

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

describe('useWineCollection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns wines data when API call succeeds', async () => {
        const mockWines: GetWineDTO[] = [
            {
                id: '1',
                name: 'Bordeaux 2020',
                vintage_year: 2020,
                country: 'France',
                type: 'RED',
                rating: 'GOOD',
            },
            {
                id: '2',
                name: 'Chianti 2019',
                vintage_year: 2019,
                country: 'Italy',
                type: 'RED',
                rating: 'OK',
            },
        ];

        mockGetAllUserWines.mockResolvedValue(mockWines);

        const { result } = renderHook(() => useWineCollection(), {
            wrapper: createWrapper(),
        });

        await vi.waitFor(() => {
            expect(result.current.wines).toEqual(mockWines);
        });

        expect(result.current.error).toBeNull();
    });

    it('returns empty array when no wines found', async () => {
        mockGetAllUserWines.mockResolvedValue([]);

        const { result } = renderHook(() => useWineCollection(), {
            wrapper: createWrapper(),
        });

        await vi.waitFor(() => {
            expect(result.current.wines).toEqual([]);
        });

        expect(result.current.error).toBeNull();
    });

    it('calls getAllUserWines API function', async () => {
        mockGetAllUserWines.mockResolvedValue([]);

        renderHook(() => useWineCollection(), {
            wrapper: createWrapper(),
        });

        await vi.waitFor(() => {
            expect(mockGetAllUserWines).toHaveBeenCalledTimes(1);
        });
    });
});