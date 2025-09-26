import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from './HomePage';
import { useAuth } from '../../hooks/useAuth';

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
    Link: ({
        to,
        children,
        className,
    }: {
        to: string;
        children: React.ReactNode;
        className?: string;
    }) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

describe('HomePage', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            error: null,
            logout: mockLogout,
        });
        mockLogout.mockClear();
    });

    it('renders dashboard heading and subtitle', () => {
        render(<HomePage />);

        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
        expect(screen.getByText('Welcome back to your wine collection')).toBeInTheDocument();
    });

    it('renders main action buttons', () => {
        render(<HomePage />);

        expect(screen.getByRole('button', { name: 'Search Wine' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'View Wines' })).toBeInTheDocument();
    });

    it('renders sign out button', () => {
        render(<HomePage />);

        expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    });

    it('calls logout function when sign out button is clicked', async () => {
        const user = userEvent.setup();
        render(<HomePage />);

        const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
        await user.click(signOutButton);

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('renders simplified button layout', () => {
        render(<HomePage />);

        // Check that all three main buttons are present
        expect(screen.getByRole('button', { name: 'Search Wine' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'View Wines' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    });
});
