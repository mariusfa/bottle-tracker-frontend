import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from './HomePage';
import * as useAuthModule from '../../hooks/useAuth';

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

const mockUseAuth = vi.mocked(useAuthModule.useAuth);

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

    it('renders collection stats', () => {
        render(<HomePage />);

        expect(screen.getByText('My Collection')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('bottles tracked')).toBeInTheDocument();
    });

    it('renders recent activity section', () => {
        render(<HomePage />);

        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('No recent activity')).toBeInTheDocument();
    });

    it('renders quick actions buttons', () => {
        render(<HomePage />);

        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search Wine' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'View Collection' })).toBeInTheDocument();
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

    it('renders dashboard in a grid layout', () => {
        render(<HomePage />);

        // Check that all three main sections are present
        expect(screen.getByText('My Collection')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
});
