import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WelcomePage } from './WelcomePage';

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
        <a href={to}>{children}</a>
    ),
}));

describe('WelcomePage', () => {
    it('renders welcome heading and subtitle', () => {
        render(<WelcomePage />);

        expect(
            screen.getByRole('heading', { name: 'Welcome to Bottle Tracker' })
        ).toBeInTheDocument();
        expect(screen.getByText('Your personal wine collection manager')).toBeInTheDocument();
    });

    it('renders description text', () => {
        render(<WelcomePage />);

        expect(
            screen.getByText(
                'Get started by creating an account or signing in to manage your wine collection.'
            )
        ).toBeInTheDocument();
    });

    it('renders Create Account button with correct link', () => {
        render(<WelcomePage />);

        const createAccountLink = screen.getByRole('link', { name: 'Create Account' });
        expect(createAccountLink).toBeInTheDocument();
        expect(createAccountLink).toHaveAttribute('href', '/register');
    });

    it('renders Sign In button with correct link', () => {
        render(<WelcomePage />);

        const signInLink = screen.getByRole('link', { name: 'Sign In' });
        expect(signInLink).toBeInTheDocument();
        expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('renders buttons in correct order', () => {
        render(<WelcomePage />);

        const links = screen.getAllByRole('link');
        const createAccountLink = links.find(link => link.textContent === 'Create Account');
        const signInLink = links.find(link => link.textContent === 'Sign In');

        expect(createAccountLink).toBeInTheDocument();
        expect(signInLink).toBeInTheDocument();
    });
});
