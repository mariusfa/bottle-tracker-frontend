import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WineCollectionPage } from './WineCollectionPage';
import { useWineCollection } from './hooks/useWineCollection';
import type { GetWineDTO } from '../../types/wine';

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
    Link: ({
        to,
        children,
        params,
    }: {
        to: string;
        children: React.ReactNode;
        params?: Record<string, string>;
    }) => (
        <a href={params ? `${to}/${params.id}` : to}>
            {children}
        </a>
    ),
}));

// Mock the useWineCollection hook
vi.mock('./hooks/useWineCollection', () => ({
    useWineCollection: vi.fn(),
}));

const mockUseWineCollection = vi.mocked(useWineCollection);

const mockWines: GetWineDTO[] = [
    {
        id: '1',
        name: 'Bordeaux 2020',
        vintage_year: 2020,
        country: 'France',
        type: 'RED',
        rating: 'GOOD',
    },
    {
        id: '2',
        name: 'Chianti 2019',
        vintage_year: 2019,
        country: 'Italy',
        type: 'RED',
        rating: 'OK',
    },
];

describe('WineCollectionPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders page header', () => {
        mockUseWineCollection.mockReturnValue({
            wines: [],
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByRole('heading', { name: 'My Wine Collection' })).toBeInTheDocument();
        expect(screen.getByText('View and manage your saved wines')).toBeInTheDocument();
    });

    it('shows loading message when loading', () => {
        mockUseWineCollection.mockReturnValue({
            wines: [],
            isLoading: true,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText('Loading wines...')).toBeInTheDocument();
    });

    it('shows error message when there is an error', () => {
        const errorMessage = 'Failed to fetch wines';
        mockUseWineCollection.mockReturnValue({
            wines: [],
            isLoading: false,
            error: errorMessage,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText(`Error loading wines: ${errorMessage}`)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    it('shows empty state when no wines are found', () => {
        mockUseWineCollection.mockReturnValue({
            wines: [],
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText('No wines in your collection yet.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search for Wines' })).toBeInTheDocument();
    });

    it('displays wines count correctly for single wine', () => {
        mockUseWineCollection.mockReturnValue({
            wines: [mockWines[0]],
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText('1 wine in your collection')).toBeInTheDocument();
    });

    it('displays wines count correctly for multiple wines', () => {
        mockUseWineCollection.mockReturnValue({
            wines: mockWines,
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText('2 wines in your collection')).toBeInTheDocument();
    });

    it('renders wine list when wines are available', () => {
        mockUseWineCollection.mockReturnValue({
            wines: mockWines,
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText('Bordeaux 2020')).toBeInTheDocument();
        expect(screen.getAllByText('RED')).toHaveLength(2);
        expect(screen.getByText('France')).toBeInTheDocument();
        expect(screen.getByText('GOOD')).toBeInTheDocument();

        expect(screen.getByText('Chianti 2019')).toBeInTheDocument();
        expect(screen.getByText('Italy')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('renders wine details with proper labels', () => {
        mockUseWineCollection.mockReturnValue({
            wines: [mockWines[0]],
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.getByText('Type:')).toBeInTheDocument();
        expect(screen.getByText('Year:')).toBeInTheDocument();
        expect(screen.getByText('Country:')).toBeInTheDocument();
        expect(screen.getByText('Rating:')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
    });

    it('renders view details buttons for each wine', () => {
        mockUseWineCollection.mockReturnValue({
            wines: mockWines,
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        const viewDetailsButtons = screen.getAllByRole('button', { name: 'View Details' });
        expect(viewDetailsButtons).toHaveLength(2);
    });

    it('applies correct rating color classes', () => {
        const wineWithGoodRating = { ...mockWines[0], rating: 'GOOD' as const };
        const wineWithOkRating = { ...mockWines[1], rating: 'OK' as const };
        const wineWithBadRating = { ...mockWines[0], id: '3', rating: 'BAD' as const };

        mockUseWineCollection.mockReturnValue({
            wines: [wineWithGoodRating, wineWithOkRating, wineWithBadRating],
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        const goodRating = screen.getByText('GOOD');
        const okRating = screen.getByText('OK');
        const badRating = screen.getByText('BAD');

        expect(goodRating).toHaveClass('bg-green-100', 'text-green-800');
        expect(okRating).toHaveClass('bg-yellow-100', 'text-yellow-800');
        expect(badRating).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('does not render rating when wine has NONE rating', () => {
        const wineWithoutRating = { ...mockWines[0], rating: 'NONE' as const };
        mockUseWineCollection.mockReturnValue({
            wines: [wineWithoutRating],
            isLoading: false,
            error: null,
        });

        render(<WineCollectionPage />);

        expect(screen.queryByText('Rating:')).not.toBeInTheDocument();
    });

    it('reloads page when try again button is clicked', async () => {
        const mockReload = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: mockReload },
            writable: true,
        });

        const user = userEvent.setup();
        mockUseWineCollection.mockReturnValue({
            wines: [],
            isLoading: false,
            error: 'Test error',
        });

        render(<WineCollectionPage />);

        const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
        await user.click(tryAgainButton);

        expect(mockReload).toHaveBeenCalledTimes(1);
    });
});