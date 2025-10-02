import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useRegisterForm } from './useRegisterForm';
import * as userApi from '../../../services/userApi';

// Mock the userApi
vi.mock('../../../services/userApi', () => ({
    registerUser: vi.fn(),
}));

const mockRegisterUser = vi.mocked(userApi.registerUser);

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

describe('useRegisterForm', () => {
    beforeEach(() => {
        mockRegisterUser.mockClear();
        vi.clearAllMocks();
    });

    it('initializes with empty form data and no errors', () => {
        const { result } = renderHook(() => useRegisterForm(), {
            wrapper: createWrapper(),
        });

        expect(result.current.formData).toEqual({
            name: '',
            password: '',
            confirmPassword: '',
        });
        expect(result.current.errors).toEqual({});
        expect(result.current.generalError).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
    });

    it('updates form data on input change', () => {
        const { result } = renderHook(() => useRegisterForm(), {
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
        const { result } = renderHook(() => useRegisterForm(), {
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
        const { result } = renderHook(() => useRegisterForm(), {
            wrapper: createWrapper(),
        });

        // First, simulate a general error by triggering a failed submission
        mockRegisterUser.mockRejectedValue(new Error('Network error'));

        act(() => {
            result.current.handleInputChange({
                target: { name: 'name', value: 'John' },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleInputChange({
                target: { name: 'password', value: 'pass123' },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleInputChange({
                target: { name: 'confirmPassword', value: 'pass123' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
            await result.current.handleSubmit(mockEvent);
        });

        // Verify general error is set
        expect(result.current.generalError).toBe(true);

        // Now clear the mock and type in a field
        mockRegisterUser.mockClear();

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
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Name is required');
        });

        it('validates minimum name length', () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                const mockEvent = {
                    target: { name: 'name', value: 'A' },
                } as React.ChangeEvent<HTMLInputElement>;
                result.current.handleInputChange(mockEvent);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Name must be at least 2 characters');
        });

        it('trims whitespace from name validation', () => {
            const { result } = renderHook(() => useRegisterForm(), {
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
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.password).toBe('Password is required');
        });

        it('validates minimum password length', () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                const mockEvent = {
                    target: { name: 'password', value: '12345' },
                } as React.ChangeEvent<HTMLInputElement>;
                result.current.handleInputChange(mockEvent);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.password).toBe('Password must be at least 6 characters');
        });

        it('validates password confirmation is required', () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                // Set valid name and password
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

            expect(isValid).toBe(false);
            expect(result.current.errors.confirmPassword).toBe('Please confirm your password');
        });

        it('validates passwords match', () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'different123' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.confirmPassword).toBe('Passwords do not match');
        });

        it('returns true when all validation passes', () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'password123' },
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
            const { result } = renderHook(() => useRegisterForm(), {
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
            expect(mockRegisterUser).not.toHaveBeenCalled();
        });

        it('submits form with valid data', async () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            mockRegisterUser.mockResolvedValue();

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'JohnDoe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'password123' },
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
            expect(mockRegisterUser).toHaveBeenCalledWith({
                name: 'JohnDoe',
                password: 'password123',
            });
            expect(result.current.isSuccess).toBe(true);
            expect(result.current.registeredUsername).toBe('JohnDoe');
        });

        it('handles user already exists error', async () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            mockRegisterUser.mockRejectedValue(new Error('User already exists'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.errors.name).toBe('A user with this name already exists');
            expect(result.current.generalError).toBe(false);
        });

        it('handles generic registration errors with generalError', async () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            mockRegisterUser.mockRejectedValue(new Error('Network error'));

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            await act(async () => {
                const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.generalError).toBe(true);
            expect(result.current.errors.name).toBeUndefined();
        });

        it('sets and resets isSubmitting state during submission', async () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            mockRegisterUser.mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'John Doe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'password123' },
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

    describe('resetForm', () => {
        it('resets all form state to initial values', async () => {
            const { result } = renderHook(() => useRegisterForm(), {
                wrapper: createWrapper(),
            });

            // Set some form data and success state
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: 'JohnDoe' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'password', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
                result.current.handleInputChange({
                    target: { name: 'confirmPassword', value: 'password123' },
                } as React.ChangeEvent<HTMLInputElement>);
            });

            // Mock successful registration (API returns void, not token)
            mockRegisterUser.mockResolvedValue(undefined);

            await act(async () => {
                const mockEvent = {
                    preventDefault: vi.fn(),
                } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            // Wait for mutation to complete and success state to update
            await act(async () => {
                await vi.waitFor(() => expect(result.current.isSuccess).toBe(true));
            });

            expect(result.current.registeredUsername).toBe('JohnDoe');

            // Reset form
            act(() => {
                result.current.resetForm();
            });

            expect(result.current.formData).toEqual({
                name: '',
                password: '',
                confirmPassword: '',
            });
            expect(result.current.errors).toEqual({});
            expect(result.current.isSuccess).toBe(false);
            expect(result.current.registeredUsername).toBe(null);
        });
    });
});
