import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

// Mock TanStack Router hooks
vi.mock('@tanstack/react-router', () => ({
    useSearch: vi.fn(),
}));

// Mock the useLoginForm hook for isolated component testing
vi.mock('./hooks/useLoginForm', () => ({
    useLoginForm: vi.fn(),
}));

import { useSearch } from '@tanstack/react-router';
import { useLoginForm } from './hooks/useLoginForm';

const mockUseLoginForm = vi.mocked(useLoginForm);
const mockUseSearch = vi.mocked(useSearch);

const renderLoginPage = (hookReturnValue: ReturnType<typeof useLoginForm>, searchParams = {}) => {
    mockUseLoginForm.mockReturnValue(hookReturnValue);
    mockUseSearch.mockReturnValue(searchParams);
    return render(<LoginPage />);
};

describe('LoginPage', () => {
    const defaultHookReturn = {
        formData: { name: '', password: '' },
        errors: {},
        generalError: undefined,
        isSubmitting: false,
        handleInputChange: vi.fn(),
        handleSubmit: vi.fn(),
        validateForm: vi.fn(),
    };

    it('renders login form with all fields', () => {
        renderLoginPage(defaultHookReturn);

        expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('displays form values from hook', () => {
        const hookReturn = {
            ...defaultHookReturn,
            formData: { name: 'John Doe', password: 'password123' },
        };
        renderLoginPage(hookReturn);

        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
    });

    it('displays validation errors from hook', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: {
                name: 'Name is required',
                password: 'Password is required',
            },
        };
        renderLoginPage(hookReturn);

        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('calls handleInputChange when typing in fields', async () => {
        const user = userEvent.setup();
        const handleInputChange = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleInputChange,
        };
        renderLoginPage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        await user.type(nameInput, 'John');

        expect(handleInputChange).toHaveBeenCalledTimes(4); // One for each character
        expect(handleInputChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    name: 'name',
                }),
            })
        );
    });

    it('calls handleSubmit when form is submitted', async () => {
        const handleSubmit = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleSubmit,
        };
        renderLoginPage(hookReturn);

        const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
        fireEvent.submit(form!);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                preventDefault: expect.any(Function),
            })
        );
    });

    it('shows loading state when submitting', () => {
        const hookReturn = {
            ...defaultHookReturn,
            isSubmitting: true,
        };
        renderLoginPage(hookReturn);

        const submitButton = screen.getByRole('button', { name: /signing in.../i });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveClass('cursor-not-allowed');
    });

    it('applies error styling to fields with errors', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: { name: 'Name is required' },
        };
        renderLoginPage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toHaveClass('border-red-500');
    });

    it('applies normal styling to fields without errors', () => {
        renderLoginPage(defaultHookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toHaveClass('border-gray-300');
        expect(nameInput).not.toHaveClass('border-red-500');
    });

    it('passes username from search params to useLoginForm hook', () => {
        const searchParams = { username: 'TestUser' };
        renderLoginPage(defaultHookReturn, searchParams);

        expect(mockUseLoginForm).toHaveBeenCalledWith({ initialUsername: 'TestUser' });
    });

    it('handles empty username from search params', () => {
        const searchParams = {};
        renderLoginPage(defaultHookReturn, searchParams);

        expect(mockUseLoginForm).toHaveBeenCalledWith({ initialUsername: '' });
    });

    it('displays general error when present', () => {
        const hookReturn = {
            ...defaultHookReturn,
            generalError: 'A technical error occurred. Please try again.',
        };
        renderLoginPage(hookReturn);

        expect(
            screen.getByText('A technical error occurred. Please try again.')
        ).toBeInTheDocument();
        expect(screen.getByText('A technical error occurred. Please try again.')).toHaveClass(
            'bg-red-50',
            'border-red-200',
            'text-red-700'
        );
    });

    it('does not display error UI when no general error', () => {
        renderLoginPage(defaultHookReturn);

        expect(screen.queryByText(/technical error/i)).not.toBeInTheDocument();
    });
});
