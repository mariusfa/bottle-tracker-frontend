import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';

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

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from '../../hooks/useAuth';
const mockUseAuth = vi.mocked(useAuth);

describe('Header', () => {
    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            error: null,
            logout: vi.fn(),
        });
    });

    it('renders the logo with wine emoji', () => {
        render(<Header />);

        const logo = screen.getByText('🍷 Bottle Tracker');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveClass('text-2xl', 'font-bold', 'text-blue-700');
    });

    it('renders navigation links', () => {
        render(<Header />);

        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('logo links to home page', () => {
        render(<Header />);

        const logo = screen.getByText('🍷 Bottle Tracker');
        expect(logo.closest('a')).toHaveAttribute('href', '/');
    });

    it('sign in button links to login page', () => {
        render(<Header />);

        const signInLink = screen.getByText('Sign In');
        expect(signInLink.closest('a')).toHaveAttribute('href', '/login');
    });

    it('get started button links to register page', () => {
        render(<Header />);

        const getStartedLink = screen.getByText('Get Started');
        expect(getStartedLink.closest('a')).toHaveAttribute('href', '/register');
    });

    it('applies correct styling classes', () => {
        render(<Header />);

        const signInLink = screen.getByText('Sign In');
        expect(signInLink).toHaveClass('text-gray-600', 'hover:text-gray-900');

        const getStartedLink = screen.getByText('Get Started');
        expect(getStartedLink).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    describe('Mobile Navigation', () => {
        it('shows desktop navigation with responsive classes', () => {
            render(<Header />);

            const desktopNav = screen.getByTestId('desktop-nav');
            expect(desktopNav).toHaveClass('hidden', 'md:flex');
        });

        it('shows hamburger menu button with responsive classes', () => {
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            expect(hamburgerButton).toBeInTheDocument();
            expect(hamburgerButton.parentElement).toHaveClass('md:hidden');
        });

        it('hamburger button has proper ARIA attributes when closed', () => {
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('does not show mobile dropdown initially', () => {
            render(<Header />);

            expect(screen.queryByTestId('mobile-dropdown')).not.toBeInTheDocument();
        });

        it('opens mobile dropdown when hamburger is clicked', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await user.click(hamburgerButton);

            expect(screen.getByTestId('mobile-dropdown')).toBeInTheDocument();
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
        });

        it('closes mobile dropdown when hamburger is clicked again', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            
            // Open dropdown
            await user.click(hamburgerButton);
            expect(screen.getByTestId('mobile-dropdown')).toBeInTheDocument();

            // Close dropdown
            await user.click(hamburgerButton);
            expect(screen.queryByTestId('mobile-dropdown')).not.toBeInTheDocument();
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('shows navigation items in mobile dropdown for unauthenticated users', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await user.click(hamburgerButton);

            const dropdown = screen.getByTestId('mobile-dropdown');
            const dropdownSignIn = dropdown.querySelector('a[href="/login"]');
            const dropdownGetStarted = dropdown.querySelector('a[href="/register"]');
            
            expect(dropdownSignIn).toHaveTextContent('Sign In');
            expect(dropdownGetStarted).toHaveTextContent('Get Started');
        });

        it('closes dropdown when clicking outside', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await user.click(hamburgerButton);
            
            expect(screen.getByTestId('mobile-dropdown')).toBeInTheDocument();

            // Click outside the dropdown
            await user.click(document.body);
            expect(screen.queryByTestId('mobile-dropdown')).not.toBeInTheDocument();
        });

        it('closes dropdown when pressing Escape key', async () => {
            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await user.click(hamburgerButton);
            
            expect(screen.getByTestId('mobile-dropdown')).toBeInTheDocument();

            // Press escape key
            await user.keyboard('{Escape}');
            expect(screen.queryByTestId('mobile-dropdown')).not.toBeInTheDocument();
        });
    });

    describe('Authenticated Mobile Navigation', () => {
        it('shows authenticated navigation items in mobile dropdown', async () => {
            // Mock authenticated state
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                isLoading: false,
                error: null,
                logout: vi.fn(),
            });

            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await user.click(hamburgerButton);

            const dropdown = screen.getByTestId('mobile-dropdown');
            const dropdownSearchWine = dropdown.querySelector('a[href="/wines/search"]');
            const dropdownSignOut = dropdown.querySelector('button');
            
            expect(dropdownSearchWine).toHaveTextContent('Search Wine');
            expect(dropdownSignOut).toHaveTextContent('Sign Out');
        });

        it('calls logout when Sign Out is clicked in mobile dropdown', async () => {
            const mockLogout = vi.fn();
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                isLoading: false,
                error: null,
                logout: mockLogout,
            });

            const user = userEvent.setup();
            render(<Header />);

            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await user.click(hamburgerButton);

            const dropdown = screen.getByTestId('mobile-dropdown');
            const signOutButton = dropdown.querySelector('button');
            
            expect(signOutButton).toBeInTheDocument();
            
            if (signOutButton) {
                await user.click(signOutButton);
                expect(mockLogout).toHaveBeenCalledTimes(1);
            }
        }, 10000);
    });
});
