import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegisterForm } from './useRegisterForm';

// Mock console.log and alert for testing
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('useRegisterForm', () => {
    beforeEach(() => {
        mockConsoleLog.mockClear();
        mockAlert.mockClear();
    });

    it('initializes with empty form data and no errors', () => {
        const { result } = renderHook(() => useRegisterForm());

        expect(result.current.formData).toEqual({
            name: '',
            password: '',
            confirmPassword: '',
        });
        expect(result.current.errors).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
    });

    it('updates form data on input change', () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'John Doe' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.formData.name).toBe('John Doe');
    });

    it('clears errors when user starts typing in a field with errors', () => {
        const { result } = renderHook(() => useRegisterForm());

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

    describe('validateForm', () => {
        it('validates required name field', () => {
            const { result } = renderHook(() => useRegisterForm());

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Name is required');
        });

        it('validates minimum name length', () => {
            const { result } = renderHook(() => useRegisterForm());

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
            const { result } = renderHook(() => useRegisterForm());

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
            const { result } = renderHook(() => useRegisterForm());

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.password).toBe('Password is required');
        });

        it('validates minimum password length', () => {
            const { result } = renderHook(() => useRegisterForm());

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
            const { result } = renderHook(() => useRegisterForm());

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
            const { result } = renderHook(() => useRegisterForm());

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
            const { result } = renderHook(() => useRegisterForm());

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
            const { result } = renderHook(() => useRegisterForm());
            const mockPreventDefault = vi.fn();

            await act(async () => {
                const mockEvent = {
                    preventDefault: mockPreventDefault,
                } as unknown as React.FormEvent;
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockPreventDefault).toHaveBeenCalled();
            expect(result.current.isSubmitting).toBe(false);
            expect(mockConsoleLog).not.toHaveBeenCalled();
        });

        it('submits form with valid data', async () => {
            const { result } = renderHook(() => useRegisterForm());

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: '  John Doe  ' },
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
            expect(mockConsoleLog).toHaveBeenCalledWith('Registration data:', {
                name: 'John Doe', // Should be trimmed
                password: 'password123',
            });
            expect(mockAlert).toHaveBeenCalledWith('Registration successful! (Mock response)');
        });

        it('sets and resets isSubmitting state during submission', async () => {
            const { result } = renderHook(() => useRegisterForm());

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

            // Submit the form
            const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // After completion, should not be submitting
            expect(result.current.isSubmitting).toBe(false);
        });
    });
});

