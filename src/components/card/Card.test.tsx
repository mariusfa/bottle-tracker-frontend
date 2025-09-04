import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
    it('renders children content', () => {
        render(
            <Card>
                <p>Card content</p>
            </Card>
        );

        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies base styling classes', () => {
        render(
            <Card>
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).toHaveClass('bg-white', 'shadow', 'rounded-lg');
    });

    it('applies medium padding by default', () => {
        render(
            <Card>
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).toHaveClass('p-6');
    });

    it('applies no padding when padding is none', () => {
        render(
            <Card padding="none">
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).not.toHaveClass('p-3', 'p-6', 'p-8');
    });

    it('applies small padding when specified', () => {
        render(
            <Card padding="small">
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).toHaveClass('p-3');
    });

    it('applies large padding when specified', () => {
        render(
            <Card padding="large">
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).toHaveClass('p-8');
    });

    it('applies custom className when provided', () => {
        render(
            <Card className="custom-class">
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).toHaveClass('custom-class');
    });

    it('combines default classes with custom className', () => {
        render(
            <Card className="mt-4 mb-2">
                <div data-testid="card-content">Content</div>
            </Card>
        );

        const cardContainer = screen.getByTestId('card-content').parentElement;
        expect(cardContainer).toHaveClass(
            'bg-white',
            'shadow',
            'rounded-lg',
            'p-6',
            'mt-4',
            'mb-2'
        );
    });
});
