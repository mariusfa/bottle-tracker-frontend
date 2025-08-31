import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from './RegisterPage';

// Mock the useRegisterForm hook for isolated component testing
vi.mock('../../hooks/useRegisterForm', () => ({
    useRegisterForm: vi.fn()
}));

import { useRegisterForm } from '../../hooks/useRegisterForm';

const mockUseRegisterForm = vi.mocked(useRegisterForm);

const renderRegisterPage = (hookReturnValue: ReturnType<typeof useRegisterForm>) => {
    mockUseRegisterForm.mockReturnValue(hookReturnValue);
    return render(<RegisterPage />);
};

describe('RegisterPage', () => {
    const defaultHookReturn = {
        formData: { name: '', password: '', confirmPassword: '' },
        errors: {},
        isSubmitting: false,
        handleInputChange: vi.fn(),
        handleSubmit: vi.fn(),
        validateForm: vi.fn()
    };

    it('renders registration form with all fields', () => {
        renderRegisterPage(defaultHookReturn);

        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('displays form values from hook', () => {
        const hookReturn = {
            ...defaultHookReturn,
            formData: { name: 'John Doe', password: 'password123', confirmPassword: 'password123' }
        };
        renderRegisterPage(hookReturn);

        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        const passwordInputs = screen.getAllByDisplayValue('password123');
        expect(passwordInputs).toHaveLength(2); // password and confirmPassword fields
    });

    it('displays validation errors from hook', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: {
                name: 'Name is required',
                password: 'Password must be at least 6 characters',
                confirmPassword: 'Passwords do not match'
            }
        };
        renderRegisterPage(hookReturn);

        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('calls handleInputChange when typing in fields', async () => {
        const user = userEvent.setup();
        const handleInputChange = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleInputChange
        };
        renderRegisterPage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        await user.type(nameInput, 'John');

        expect(handleInputChange).toHaveBeenCalledTimes(4); // One for each character
        expect(handleInputChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({
                name: 'name'
            })
        }));
    });

    it('calls handleSubmit when form is submitted', async () => {
        const handleSubmit = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleSubmit
        };
        renderRegisterPage(hookReturn);

        const form = screen.getByRole('button', { name: /create account/i }).closest('form');
        fireEvent.submit(form!);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
            preventDefault: expect.any(Function)
        }));
    });

    it('shows loading state when submitting', () => {
        const hookReturn = {
            ...defaultHookReturn,
            isSubmitting: true
        };
        renderRegisterPage(hookReturn);

        const submitButton = screen.getByRole('button', { name: /creating account.../i });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveClass('cursor-not-allowed');
    });

    it('applies error styling to fields with errors', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: { name: 'Name is required' }
        };
        renderRegisterPage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toHaveClass('border-red-500');
    });

    it('applies normal styling to fields without errors', () => {
        renderRegisterPage(defaultHookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        expect(nameInput).toHaveClass('border-gray-300');
        expect(nameInput).not.toHaveClass('border-red-500');
    });
});