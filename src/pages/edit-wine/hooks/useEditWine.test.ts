import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useEditWine } from './useEditWine';
import { WineType, WineRating } from '../../../types/wine';
import * as wineApi from '../../../services/wineApi';
import type { GetWineDTO } from '../../../types/wine';

// Mock TanStack Router navigation
vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
}));

// Mock the wineApi
vi.mock('../../../services/wineApi', () => ({
    getWineById: vi.fn(),
    updateWine: vi.fn(),
}));

const mockGetWineById = vi.mocked(wineApi.getWineById);
const mockUpdateWine = vi.mocked(wineApi.updateWine);
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

const mockWineData: GetWineDTO = {
    id: 'test-wine-id',
    name: 'Château Margaux',
    country: 'France',
    vintage_year: 2015,
    type: WineType.RED,
    rating: WineRating.GOOD,
    barcode: '1234567890123',
};

describe('useEditWine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    it('should return loading state initially', () => {
        mockGetWineById.mockImplementation(() => new Promise(() => {})); // Never resolves
        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoadingWine).toBe(true);
        expect(result.current.wine).toBeNull();
        expect(result.current.wineLoadError).toBeNull();
    });

    it('should load wine data and populate form after delay', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoadingWine).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        expect(result.current.wine).toBeTruthy();
        expect(result.current.wine?.id).toBe('test-wine-id');
        expect(result.current.wine?.name).toBe('Château Margaux');
        expect(result.current.formData.name).toBe('Château Margaux');
        expect(result.current.formData.country).toBe('France');
        expect(result.current.formData.vintageYear).toBe('2015');
        expect(result.current.formData.type).toBe(WineType.RED);
        expect(result.current.formData.rating).toBe(WineRating.GOOD);
        expect(result.current.formData.barcode).toBe('1234567890123');
    });

    it('should handle input changes', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        const event = {
            target: { name: 'name', value: 'New Wine Name' },
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleInputChange(event);
        });

        expect(result.current.formData.name).toBe('New Wine Name');
    });

    it('should clear error when input changes', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        // First set the formData to empty to trigger validation error
        act(() => {
            const changeEvent = {
                target: { name: 'name', value: '' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(changeEvent);
        });

        // Trigger validation error
        const submitEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        act(() => {
            result.current.handleSubmit(submitEvent);
        });

        expect(result.current.errors.name).toBeTruthy();

        // Change input to clear error
        const changeEvent = {
            target: { name: 'name', value: 'New Name' },
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleInputChange(changeEvent);
        });

        expect(result.current.errors.name).toBeUndefined();
    });

    it('should validate required fields', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        // Clear required fields using handleInputChange
        act(() => {
            result.current.handleInputChange({
                target: { name: 'name', value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleInputChange({
                target: { name: 'country', value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleInputChange({
                target: { name: 'type', value: '' },
            } as React.ChangeEvent<HTMLSelectElement>);
        });

        let isValid = false;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.name).toBe('Wine name is required');
        expect(result.current.errors.country).toBe('Country is required');
        expect(result.current.errors.type).toBe('Wine type is required');
    });

    it('should validate vintage year format', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        // Set invalid vintage year
        act(() => {
            result.current.handleInputChange({
                target: { name: 'vintageYear', value: '99' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        let isValid = false;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.vintageYear).toBe('Vintage year must be exactly 4 digits');
    });

    it('should allow empty vintage year', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        // Clear vintage year
        act(() => {
            result.current.handleInputChange({
                target: { name: 'vintageYear', value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        let isValid = false;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.vintageYear).toBeUndefined();
    });

    it('should handle form submission successfully', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);
        mockUpdateWine.mockResolvedValue();

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        const event = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        act(() => {
            result.current.handleSubmit(event);
        });

        await waitFor(() => {
            expect(result.current.isSubmitting).toBe(false);
        });

        expect(mockUpdateWine).toHaveBeenCalledWith('test-wine-id', {
            name: 'Château Margaux',
            country: 'France',
            vintage_year: 2015,
            type: WineType.RED,
            rating: WineRating.GOOD,
            barcode: '1234567890123',
        });

        expect(mockNavigate).toHaveBeenCalledWith({
            to: '/wines/$id',
            params: { id: 'test-wine-id' },
        });
    });

    it('should not submit form if validation fails', async () => {
        mockGetWineById.mockResolvedValue(mockWineData);

        const { result } = renderHook(() => useEditWine('test-wine-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        // Clear required field
        act(() => {
            result.current.handleInputChange({
                target: { name: 'name', value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        const event = { preventDefault: vi.fn() } as unknown as React.FormEvent;

        act(() => {
            result.current.handleSubmit(event);
        });

        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.errors.name).toBeTruthy();
        expect(mockUpdateWine).not.toHaveBeenCalled();
    });

    it('should reload wine data when wineId changes', async () => {
        const wine1: GetWineDTO = { ...mockWineData, id: 'wine-1', name: 'Wine 1' };
        const wine2: GetWineDTO = { ...mockWineData, id: 'wine-2', name: 'Wine 2' };

        mockGetWineById.mockResolvedValueOnce(wine1).mockResolvedValueOnce(wine2);

        const { result, rerender } = renderHook(
            ({ wineId }) => useEditWine(wineId),
            {
                wrapper: createWrapper(),
                initialProps: { wineId: 'wine-1' },
            }
        );

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        expect(result.current.wine?.id).toBe('wine-1');
        expect(result.current.wine?.name).toBe('Wine 1');

        // Change wineId
        rerender({ wineId: 'wine-2' });

        await waitFor(() => {
            expect(result.current.isLoadingWine).toBe(false);
        });

        expect(result.current.wine?.id).toBe('wine-2');
        expect(result.current.wine?.name).toBe('Wine 2');
    });
});
