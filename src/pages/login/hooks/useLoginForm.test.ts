import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoginForm } from './useLoginForm';

// Mock console.log and alert for testing
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('useLoginForm', () => {
    beforeEach(() => {
        mockConsoleLog.mockClear();
        mockAlert.mockClear();
    });

    it('initializes with empty form data and no errors', () => {
        const { result } = renderHook(() => useLoginForm());

        expect(result.current.formData).toEqual({
            name: '',
            password: '',
        });
        expect(result.current.errors).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
    });

    it('updates form data on input change', () => {
        const { result } = renderHook(() => useLoginForm());

        act(() => {
            const mockEvent = {
                target: { name: 'name', value: 'John Doe' },
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.formData.name).toBe('John Doe');
    });

    it('clears errors when user starts typing in a field with errors', () => {
        const { result } = renderHook(() => useLoginForm());

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
            const { result } = renderHook(() => useLoginForm());

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.name).toBe('Name is required');
        });

        it('trims whitespace from name validation', () => {
            const { result } = renderHook(() => useLoginForm());

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
            const { result } = renderHook(() => useLoginForm());

            let isValid: boolean = false;
            act(() => {
                isValid = result.current.validateForm();
            });

            expect(isValid).toBe(false);
            expect(result.current.errors.password).toBe('Password is required');
        });

        it('returns true when all validation passes', () => {
            const { result } = renderHook(() => useLoginForm());

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
            const { result } = renderHook(() => useLoginForm());
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
            const { result } = renderHook(() => useLoginForm());

            // Set up valid form data
            act(() => {
                result.current.handleInputChange({
                    target: { name: 'name', value: '  John Doe  ' },
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
            expect(mockConsoleLog).toHaveBeenCalledWith('Login data:', {
                name: 'John Doe', // Should be trimmed
                password: 'password123',
            });
            expect(mockAlert).toHaveBeenCalledWith('Login successful! (Mock response)');
        });

        it('sets and resets isSubmitting state during submission', async () => {
            const { result } = renderHook(() => useLoginForm());

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