import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
    it('renders title', () => {
        render(<PageHeader title="Test Title" />);

        expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
        render(<PageHeader title="Title" subtitle="Test subtitle" />);

        expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
        render(<PageHeader title="Title" />);

        expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument();
    });

    it('applies center alignment by default', () => {
        render(<PageHeader title="Title" />);

        const container = screen.getByRole('heading').parentElement;
        expect(container).toHaveClass('text-center');
    });

    it('applies left alignment when specified', () => {
        render(<PageHeader title="Title" align="left" />);

        const container = screen.getByRole('heading').parentElement;
        expect(container).toHaveClass('text-left');
        expect(container).not.toHaveClass('text-center');
    });

    it('applies title styling', () => {
        render(<PageHeader title="Styled Title" />);

        const heading = screen.getByRole('heading');
        expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-blue-600', 'mb-2');
    });

    it('applies subtitle styling', () => {
        render(<PageHeader title="Title" subtitle="Styled subtitle" />);

        const subtitle = screen.getByText('Styled subtitle');
        expect(subtitle).toHaveClass('text-gray-600');
    });

    it('applies custom className when provided', () => {
        render(<PageHeader title="Title" className="custom-class" />);

        const container = screen.getByRole('heading').parentElement;
        expect(container).toHaveClass('custom-class');
    });

    it('applies default margin bottom', () => {
        render(<PageHeader title="Title" />);

        const container = screen.getByRole('heading').parentElement;
        expect(container).toHaveClass('mb-8');
    });

    it('combines all classes correctly', () => {
        render(<PageHeader title="Title" subtitle="Sub" align="left" className="extra" />);

        const container = screen.getByRole('heading').parentElement;
        expect(container).toHaveClass('mb-8', 'text-left', 'extra');
    });
});