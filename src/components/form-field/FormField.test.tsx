import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';

describe('FormField', () => {
    const defaultProps = {
        label: 'Test Label',
        type: 'text' as const,
        name: 'testField',
        value: '',
        onChange: vi.fn(),
    };

    it('renders label and input field', () => {
        render(<FormField {...defaultProps} />);

        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays the current value', () => {
        render(<FormField {...defaultProps} value="test value" />);

        expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
        render(<FormField {...defaultProps} placeholder="Enter text here" />);

        expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<FormField {...defaultProps} onChange={onChange} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'a');

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    name: 'testField',
                }),
            })
        );
    });

    it('renders password input when type is password', () => {
        render(<FormField {...defaultProps} type="password" />);

        const input = screen.getByLabelText('Test Label');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('renders email input when type is email', () => {
        render(<FormField {...defaultProps} type="email" />);

        const input = screen.getByLabelText('Test Label');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('displays error message when error prop is provided', () => {
        render(<FormField {...defaultProps} error="This field is required" />);

        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
    });

    it('applies error styling to input when error is present', () => {
        render(<FormField {...defaultProps} error="Error message" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    it('applies normal styling to input when no error', () => {
        render(<FormField {...defaultProps} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-gray-300');
        expect(input).not.toHaveClass('border-red-500');
    });

    it('uses custom id when provided', () => {
        render(<FormField {...defaultProps} id="custom-id" />);

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Test Label');

        expect(input).toHaveAttribute('id', 'custom-id');
        expect(label).toHaveAttribute('for', 'custom-id');
    });

    it('uses name as id when no custom id provided', () => {
        render(<FormField {...defaultProps} name="fieldName" />);

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Test Label');

        expect(input).toHaveAttribute('id', 'fieldName');
        expect(label).toHaveAttribute('for', 'fieldName');
    });

    it('does not render error text when no error provided', () => {
        render(<FormField {...defaultProps} />);

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
});
