import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RatingBadge } from './RatingBadge';

describe('RatingBadge', () => {
    it('renders GOOD rating with green styling', () => {
        render(<RatingBadge rating="GOOD" />);

        const badge = screen.getByText('GOOD');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'rounded-full');
    });

    it('renders OK rating with yellow styling', () => {
        render(<RatingBadge rating="OK" />);

        const badge = screen.getByText('OK');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'rounded-full');
    });

    it('renders BAD rating with red styling', () => {
        render(<RatingBadge rating="BAD" />);

        const badge = screen.getByText('BAD');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'rounded-full');
    });

    it('does not render when rating is NONE', () => {
        render(<RatingBadge rating="NONE" />);

        expect(screen.queryByText('NONE')).not.toBeInTheDocument();
    });

    it('uses pill variant by default', () => {
        render(<RatingBadge rating="GOOD" />);

        const badge = screen.getByText('GOOD');
        expect(badge).toHaveClass('rounded-full');
        expect(badge).not.toHaveClass('rounded');
    });

    it('uses rounded variant when specified', () => {
        render(<RatingBadge rating="GOOD" variant="rounded" />);

        const badge = screen.getByText('GOOD');
        expect(badge).toHaveClass('rounded');
        expect(badge).not.toHaveClass('rounded-full');
    });

    it('applies base classes to all ratings', () => {
        render(<RatingBadge rating="GOOD" />);

        const badge = screen.getByText('GOOD');
        expect(badge).toHaveClass('inline-flex', 'px-2', 'py-1', 'text-xs', 'font-medium');
    });
});