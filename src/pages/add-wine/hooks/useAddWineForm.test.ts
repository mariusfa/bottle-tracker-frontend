import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAddWineForm } from './useAddWineForm';
import * as wineApi from '../../../services/wineApi';
import { WineType, WineRating } from '../../../types/wine';

// Mock TanStack Router navigation
vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
    useSearch: vi.fn(),
}));

// Mock the wineApi
vi.mock('../../../services/wineApi', () => ({
    createWine: vi.fn(),
    getExternalWineByBarcode: vi.fn(),
}));

const mockCreateWine = vi.mocked(wineApi.createWine);
const mockGetExternalWineByBarcode = vi.mocked(wineApi.getExternalWineByBarcode);
const mockNavigate = vi.fn();

// Import after mocking
import { useNavigate, useSearch } from '@tanstack/react-router';
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseSearch = vi.mocked(useSearch);

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

describe('useAddWineForm', () => {
    beforeEach(() => {
        mockCreateWine.mockClear();
        mockGetExternalWineByBarcode.mockClear();
        mockNavigate.mockClear();
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseSearch.mockReturnValue({});
        vi.clearAllMocks();
    });

    it('initializes with empty form data and no errors', () => {
        const { result } = renderHook(() => useAddWineForm(), {
            wrapper: createWrapper(),
        });

        expect(result.current.formData).toEqual({
            name: '',
            country: '',
            vintageYear: '',
            type: '',
            rating: WineRating.NONE,
            barcode: '',
        });
        expect(result.current.errors).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.submitError).toBe(false);
        expect(result.current.isLoadingExternal).toBe(false);
        expect(result.current.externalWineResult).toBe(null);
    });

    it('initializes with barcode from search params', async () => {
        mockUseSearch.mockReturnValue({ barcode: '123456789' });
        mockGetExternalWineByBarcode.mockResolvedValue({
            name: 'Test Wine',
            country: 'France',
            type: 'Red',
            price: 100,
            volume: 750,
        });

        const { result } = renderHook(() => useAddWineForm(), {
            wrapper: createWrapper(),
        });

        expect(result.current.formData.barcode).toBe('123456789');

        // Wait for useEffect to complete external wine fetch
        await waitFor(() => {
            expect(result.current.isLoadingExternal).toBe(false);
        });
    });

    it('updates form data on input change', () => {
        const { result } = renderHook(() => useAddWineForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'Test Wine' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.formData.name).toBe('Test Wine');
    });

    it('clears errors when user starts typing in a field with errors', () => {
        const { result } = renderHook(() => useAddWineForm(), {
            wrapper: createWrapper(),
        });

        // First, create an error by validating empty form
        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.name).toBe('Wine name is required');

        // Then type in the field to clear the error
        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'Test Wine' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.errors.name).toBeUndefined();
    });

    describe('validateForm', () => {
        it('validates required name field', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Wine name is required');
        });

        it('trims whitespace from name validation', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                const mockEvent = {
                    target: { name: 'name', value: '   ' },
                } as React.ChangeEvent<HTMLInputElement>;
                result.current.handleInputChange(mockEvent);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Wine name is required');
        });

        it('validates required country field', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.country).toBe('Country is required');
        });

        it('validates required type field', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.type).toBe('Wine type is required');
        });

        it('validates vintage year format when provided', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'vintageYear', value: '20' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            act(() => {
                result.current.validateForm();
            });

            expect(result.current.errors.vintageYear).toBe('Vintage year must be exactly 4 digits');
        });

        it('accepts valid 4-digit vintage year', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
                result.current.handleInputChange({
                    target: { name: 'vintageYear', value: '2020' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(result.current.errors.vintageYear).toBeUndefined();
        });

        it('allows empty vintage year', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(result.current.errors.vintageYear).toBeUndefined();
        });

        it('returns true when all validation passes', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Bordeaux Rouge' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(true);
            expect(Object.keys(result.current.errors)).toHaveLength(0);
        });
    });

    describe('handleSubmit', () => {
        it('prevents default and does not submit if validation fails', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });
            const mockPreventDefault = vi.fn();

            await act(async () => {
                const mockEvent = {
                    preventDefault: mockPreventDefault,
                } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(result.current.isSubmitting).toBe(false);
            expect(mockCreateWine).not.toHaveBeenCalled();
        });

        it('submits form with valid data', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            mockCreateWine.mockResolvedValue();

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: '  Bordeaux Rouge  ' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: '  France  ' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
                result.current.handleInputChange({
                    target: { name: 'rating', value: WineRating.GOOD },
                } as React.ChangeEvent<HTMLSelectElement>);
                result.current.handleInputChange({
                    target: { name: 'barcode', value: '  123456789  ' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            const mockPreventDefault = vi.fn();

            await act(async () => {
                const mockEvent = {
                    preventDefault: mockPreventDefault,
                } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(mockCreateWine).toHaveBeenCalledWith({
                name: 'Bordeaux Rouge', // Should be trimmed
                country: 'France', // Should be trimmed
                type: WineType.RED,
                rating: WineRating.GOOD,
                barcode: '123456789', // Should be trimmed
            });
            expect(result.current.submitError).toBe(false);
        });

        it('submits form with vintage year when provided', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            mockCreateWine.mockResolvedValue();

            // Set up valid form data with vintage year
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Bordeaux Rouge' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
                result.current.handleInputChange({
                    target: { name: 'vintageYear', value: '2020' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockCreateWine).toHaveBeenCalledWith({
                name: 'Bordeaux Rouge',
                country: 'France',
                type: WineType.RED,
                rating: WineRating.NONE,
                vintage_year: 2020,
                barcode: undefined, // Empty barcode should be undefined
            });
        });

        it('navigates to wines page on successful submission', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            mockCreateWine.mockResolvedValue();

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockNavigate).toHaveBeenCalledWith({ to: '/wines' });
        });

        it('does not navigate on submission failure', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            mockCreateWine.mockRejectedValueOnce(new Error('Server error'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.isSubmitting).toBe(false);
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('handles submission failure with submitError', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            mockCreateWine.mockRejectedValueOnce(new Error('Server error'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.submitError).toBe(true);
            });
        });

        it('resets submitError when trying again', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            // First submission fails
            mockCreateWine.mockRejectedValueOnce(new Error('Server error'));

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.submitError).toBe(true);
            });

            // Second submission succeeds
            mockCreateWine.mockClear();
            mockCreateWine.mockResolvedValueOnce();

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.submitError).toBe(false);
            });
        });

        it('sets and resets isSubmitting state during submission', async () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            mockCreateWine.mockImplementation(
                () => new Promise(resolve => setTimeout(() => resolve(), 100))
            );

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'country', value: 'France' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'type', value: WineType.RED },
                } as React.ChangeEvent<HTMLSelectElement>);
            });

            // Initially should not be submitting
            expect(result.current.isSubmitting).toBe(false);

            // Start the submission
            const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

            act(() => {
                result.current.handleSubmit(mockEvent);
            });

            // Should be submitting now
            expect(result.current.isSubmitting).toBe(true);

            // Wait for mutation to complete
            await act(async () => {
                await vi.waitFor(() => expect(result.current.isSubmitting).toBe(false));
            });
        });
    });

    describe('external wine functionality', () => {
        it('fetches external wine data when barcode is provided in search params', async () => {
            const mockExternalWine = {
                name: 'External Wine',
                country: 'Italy',
                type: 'Red',
                price: 150,
                volume: 750,
            };

            mockUseSearch.mockReturnValue({ barcode: '123456789' });
            mockGetExternalWineByBarcode.mockResolvedValue(mockExternalWine);

            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            // Wait for external wine fetch to complete
            await waitFor(() => {
                expect(result.current.isLoadingExternal).toBe(false);
            });

            expect(mockGetExternalWineByBarcode).toHaveBeenCalledWith('123456789');
            expect(result.current.externalWineResult).toEqual({
                wine: mockExternalWine,
                found: true,
            });
            expect(result.current.formData.name).toBe('External Wine');
            expect(result.current.formData.country).toBe('Italy');
        });

        it('handles external wine not found', async () => {
            mockUseSearch.mockReturnValue({ barcode: '123456789' });
            mockGetExternalWineByBarcode.mockRejectedValueOnce(new Error('Wine not found in external database'));

            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            // Wait for external wine fetch to complete (error handled by mutation's onError)
            await waitFor(() => {
                expect(result.current.isLoadingExternal).toBe(false);
            });

            expect(result.current.externalWineResult).toEqual({
                found: false,
            });
        });
    });

    describe('resetForm', () => {
        it('resets all form data and state', () => {
            const { result } = renderHook(() => useAddWineForm(), {
                wrapper: createWrapper(),
            });

            // Set some data first
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'Test Wine' },
                } as React.ChangeEvent<HTMLInputElement>);
                // Create an error
                result.current.validateForm();
            });

            expect(result.current.formData.name).toBe('Test Wine');
            expect(result.current.errors.country).toBeDefined();

            // Reset the form
            act(() => {
                result.current.resetForm();
            });

            expect(result.current.formData).toEqual({
                name: '',
                country: '',
                vintageYear: '',
                type: '',
                rating: WineRating.NONE,
                barcode: '',
            });
            expect(result.current.errors).toEqual({});
            expect(result.current.submitError).toBe(false);
            expect(result.current.externalWineResult).toBe(null);
        });
    });
});