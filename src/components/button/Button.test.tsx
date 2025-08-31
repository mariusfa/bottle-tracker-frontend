import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
    it('renders button with children', () => {
        render(<Button>Click me</Button>);

        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders as submit button when type is submit', () => {
        render(<Button type="submit">Submit</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders as button type by default', () => {
        render(<Button>Default</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'button');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);

        await user.click(screen.getByRole('button'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('cursor-not-allowed');
    });

    it('is disabled when loading prop is true', () => {
        render(<Button loading>Loading</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('cursor-not-allowed');
    });

    it('shows loading spinner when loading', () => {
        render(<Button loading>Loading</Button>);

        expect(screen.getByRole('button')).toContainHTML('svg');
        expect(screen.getByRole('button').querySelector('svg')).toHaveClass('animate-spin');
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Disabled</Button>);

        await user.click(screen.getByRole('button'));

        expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button loading onClick={onClick}>Loading</Button>);

        await user.click(screen.getByRole('button'));

        expect(onClick).not.toHaveBeenCalled();
    });

    it('applies primary variant styles by default', () => {
        render(<Button>Primary</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-blue-600', 'text-white');
    });

    it('applies secondary variant styles when specified', () => {
        render(<Button variant="secondary">Secondary</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-white', 'text-gray-700', 'border');
    });

    it('applies disabled styling for primary variant when disabled', () => {
        render(<Button disabled>Disabled Primary</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-blue-400');
    });

    it('applies disabled styling for secondary variant when disabled', () => {
        render(<Button variant="secondary" disabled>Disabled Secondary</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-gray-100', 'text-gray-400');
    });

    it('applies base classes to all buttons', () => {
        render(<Button>Test</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-full', 'py-2', 'px-4', 'rounded-md', 'font-medium');
    });
});