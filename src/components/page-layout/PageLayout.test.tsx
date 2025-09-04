import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageLayout } from './PageLayout';

describe('PageLayout', () => {
    it('renders children content', () => {
        render(
            <PageLayout>
                <p>Page content</p>
            </PageLayout>
        );

        expect(screen.getByText('Page content')).toBeInTheDocument();
    });

    it('applies medium max-width by default', () => {
        render(
            <PageLayout>
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        // Get the outer container (first div)
        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass('max-w-md');
    });

    it('applies small max-width when specified', () => {
        render(
            <PageLayout maxWidth="sm">
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass('max-w-sm');
    });

    it('applies large max-width when specified', () => {
        render(
            <PageLayout maxWidth="lg">
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass('max-w-lg');
    });

    it('applies extra large max-width when specified', () => {
        render(
            <PageLayout maxWidth="xl">
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass('max-w-xl');
    });

    it('applies full max-width when specified', () => {
        render(
            <PageLayout maxWidth="full">
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass('max-w-full');
    });

    it('applies base layout classes', () => {
        render(
            <PageLayout>
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        const innerContainer = screen.getByTestId('content').parentElement;

        expect(outerContainer).toHaveClass('mx-auto', 'py-6', 'sm:px-6', 'lg:px-8');
        expect(innerContainer).toHaveClass('px-4', 'py-6', 'sm:px-0');
    });

    it('applies custom className when provided', () => {
        render(
            <PageLayout className="custom-layout-class">
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass('custom-layout-class');
    });

    it('combines all classes correctly', () => {
        render(
            <PageLayout maxWidth="lg" className="extra-class">
                <div data-testid="content">Content</div>
            </PageLayout>
        );

        const outerContainer = screen.getByTestId('content').parentElement?.parentElement;
        expect(outerContainer).toHaveClass(
            'max-w-lg',
            'mx-auto',
            'py-6',
            'sm:px-6',
            'lg:px-8',
            'extra-class'
        );
    });
});
