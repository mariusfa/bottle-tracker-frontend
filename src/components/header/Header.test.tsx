import { render, screen } from '../../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        logout: vi.fn(),
    }),
}));

describe('Header', () => {
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
});