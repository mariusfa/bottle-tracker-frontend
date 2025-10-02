import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useLoginForm } from './useLoginForm';
import * as userApi from '../../../services/userApi';

// Mock TanStack Router navigation
vi.mock('@tanstack/react-router', () => ({
    useNavigate: vi.fn(),
}));

// Mock the userApi
vi.mock('../../../services/userApi', () => ({
    loginUser: vi.fn(),
}));

const mockLoginUser = vi.mocked(userApi.loginUser);
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

describe('useLoginForm', () => {
    beforeEach(() => {
        mockLoginUser.mockClear();
        mockNavigate.mockClear();
        mockUseNavigate.mockReturnValue(mockNavigate);
        vi.clearAllMocks();
    });

    it('initializes with empty form data and no errors', () => {
        const { result } = renderHook(() => useLoginForm(), {
            wrapper: createWrapper(),
        });

        expect(result.current.formData).toEqual({
            name: '',
            password: '',
        });
        expect(result.current.errors).toEqual({});
        expect(result.current.generalError).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
    });

    it('updates form data on input change', () => {
        const { result } = renderHook(() => useLoginForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'JohnDoe' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.formData.name).toBe('JohnDoe');
    });

    it('clears errors when user starts typing in a field with errors', () => {
        const { result } = renderHook(() => useLoginForm(), {
            wrapper: createWrapper(),
        });

        // First, create an error by validating empty form
        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.name).toBe('Name is required');

        // Then type in the field to clear the error
        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'John' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.errors.name).toBeUndefined();
    });

    it('clears general error when user starts typing', async () => {
        const { result } = renderHook(() => useLoginForm(), {
            wrapper: createWrapper(),
        });

        // First, simulate a general error by triggering a failed submission
        mockLoginUser.mockRejectedValue(new Error('Network error'));

        act(() => {
            result.current.handleInputChange({
                target: { name: 'name', value: 'John' },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleInputChange({
                target: { name: 'password', value: 'pass123' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
            await result.current.handleSubmit(mockEvent);
        });

        // Verify general error is set
        expect(result.current.generalError).toBe(true);

        // Now clear the mock and type in a field
        mockLoginUser.mockClear();

        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'John Updated' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        // General error should be cleared
        expect(result.current.generalError).toBe(false);
    });

    describe('validateForm', () => {
        it('validates required name field', () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Name is required');
        });

        it('trims whitespace from name validation', () => {
            const { result } = renderHook(() => useLoginForm(), {
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
            expect(result.current.errors.name).toBe('Name is required');
        });

        it('validates required password field', () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.password).toBe('Password is required');
        });

        it('returns true when all validation passes', () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
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
            const { result } = renderHook(() => useLoginForm(), {
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
            expect(mockLoginUser).not.toHaveBeenCalled();
        });

        it('submits form with valid data', async () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
            mockLoginUser.mockResolvedValue({ token: mockToken });

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'JohnDoe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
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
            expect(mockLoginUser).toHaveBeenCalledWith({
                name: 'JohnDoe',
                password: 'password123',
            });
            expect(result.current.generalError).toBe(false);
        });

        it('navigates to home page on successful login', async () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
            mockLoginUser.mockResolvedValue({ token: mockToken });

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            const mockPreventDefault = vi.fn();

            await act(async () => {
                const mockEvent = {
                    preventDefault: mockPreventDefault,
                } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
        });

        it('does not navigate on login failure', async () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            mockLoginUser.mockRejectedValue(new Error('Login failed: Internal Server Error'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'wrongpassword' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('handles login failure with invalid credentials', async () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            mockLoginUser.mockRejectedValue(new Error('Login failed: Internal Server Error'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'wrongpassword' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.errors.password).toBe('Invalid username or password');
            expect(result.current.generalError).toBe(false);
        });

        it('handles generic login errors with generalError', async () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            mockLoginUser.mockRejectedValue(new Error('Network error'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.generalError).toBe(true);
            expect(result.current.errors.password).toBeUndefined();
        });

        it('sets and resets isSubmitting state during submission', async () => {
            const { result } = renderHook(() => useLoginForm(), {
                wrapper: createWrapper(),
            });

            mockLoginUser.mockImplementation(
                () =>
                    new Promise(resolve => setTimeout(() => resolve({ token: 'test-token' }), 100))
            );

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
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
});
