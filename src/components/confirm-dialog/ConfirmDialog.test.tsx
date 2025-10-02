import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';
import type { ConfirmDialogRef } from './ConfirmDialog';
import React from 'react';

describe('ConfirmDialog', () => {
    const defaultProps = {
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        onConfirm: vi.fn(),
    };

    it('renders with default props', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} />);

        const dialog = screen.getByRole('dialog', { hidden: true });
        expect(dialog).toBeInTheDocument();
    });

    it('displays title and message', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} />);

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    it('displays custom button text', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(
            <ConfirmDialog
                ref={ref}
                {...defaultProps}
                confirmText="Yes, Delete"
                cancelText="No, Cancel"
            />
        );

        expect(screen.getByRole('button', { name: 'Yes, Delete', hidden: true })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No, Cancel', hidden: true })).toBeInTheDocument();
    });

    it('displays default button text', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'Confirm', hidden: true })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel', hidden: true })).toBeInTheDocument();
    });

    it('calls onConfirm when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const ref = React.createRef<ConfirmDialogRef>();

        render(<ConfirmDialog ref={ref} {...defaultProps} onConfirm={onConfirm} />);

        const confirmButton = screen.getByRole('button', { name: 'Confirm', hidden: true });
        await user.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('disables buttons when loading', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} isLoading={true} />);

        const confirmButton = screen.getByRole('button', { name: /confirm/i, hidden: true });
        const cancelButton = screen.getByRole('button', { name: 'Cancel', hidden: true });

        expect(confirmButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
    });

    it('shows loading spinner when isLoading is true', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} isLoading={true} />);

        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('displays error message when error prop is provided', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} error="Something went wrong" />);

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('does not display error message when error is null', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} error={null} />);

        const errorContainer = document.querySelector('.bg-red-50');
        expect(errorContainer).not.toBeInTheDocument();
    });

    it('applies danger variant styling', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} variant="danger" />);

        const confirmButton = screen.getByRole('button', { name: 'Confirm', hidden: true });
        expect(confirmButton).toHaveClass('bg-red-600');
    });

    it('applies default variant styling', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} variant="default" />);

        const confirmButton = screen.getByRole('button', { name: 'Confirm', hidden: true });
        expect(confirmButton).toHaveClass('bg-blue-600');
    });

    it('exposes showModal method via ref', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} />);

        expect(ref.current?.showModal).toBeDefined();
        expect(typeof ref.current?.showModal).toBe('function');
    });

    it('exposes close method via ref', () => {
        const ref = React.createRef<ConfirmDialogRef>();
        render(<ConfirmDialog ref={ref} {...defaultProps} />);

        expect(ref.current?.close).toBeDefined();
        expect(typeof ref.current?.close).toBe('function');
    });
});
