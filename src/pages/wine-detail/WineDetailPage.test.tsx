import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WineDetailPage } from './WineDetailPage';
import { useWineDetail } from './hooks/useWineDetail';
import type { GetWineDTO } from '../../types/wine';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
    useParams: vi.fn(),
    Link: ({
        to,
        children,
        params,
        className,
    }: {
        to: string;
        children: React.ReactNode;
        params?: Record<string, string>;
        className?: string;
    }) => (
        <a href={params ? `${to}/${params.id}` : to} className={className}>
            {children}
        </a>
    ),
}));

// Mock the useWineDetail hook
vi.mock('./hooks/useWineDetail', () => ({
    useWineDetail: vi.fn(),
}));

// Import after mocking
import { useParams } from '@tanstack/react-router';

const mockUseParams = vi.mocked(useParams);
const mockUseWineDetail = vi.mocked(useWineDetail);

const mockWineData: GetWineDTO = {
    id: 'test-wine-id',
    name: 'Château Test 2020',
    country: 'France',
    vintage_year: 2020,
    type: 'RED',
    rating: 'GOOD',
    barcode: '1234567890123',
};

describe('WineDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams.mockReturnValue({ id: 'test-wine-id' });
    });

    it('shows loading state while fetching wine data', () => {
        mockUseWineDetail.mockReturnValue({
            wine: undefined,
            isLoading: true,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getByText('Loading wine details...')).toBeInTheDocument();
    });

    it('shows error state when wine is not found', () => {
        mockUseWineDetail.mockReturnValue({
            wine: undefined,
            isLoading: false,
            error: 'Wine not found',
        });

        render(<WineDetailPage />);

        expect(screen.getByRole('heading', { name: 'Wine Not Found' })).toBeInTheDocument();
        expect(screen.getByText('Wine not found')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to Search' })).toBeInTheDocument();
    });

    it('shows error state when API error occurs', () => {
        mockUseWineDetail.mockReturnValue({
            wine: undefined,
            isLoading: false,
            error: 'Failed to fetch wine: Internal Server Error',
        });

        render(<WineDetailPage />);

        expect(screen.getByRole('heading', { name: 'Wine Not Found' })).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch wine: Internal Server Error')).toBeInTheDocument();
    });

    it('renders wine details when data is loaded', () => {
        mockUseWineDetail.mockReturnValue({
            wine: mockWineData,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getByRole('heading', { name: 'Château Test 2020' })).toBeInTheDocument();
        expect(screen.getByText('Wine Details')).toBeInTheDocument();
    });

    it('displays all wine properties correctly', () => {
        mockUseWineDetail.mockReturnValue({
            wine: mockWineData,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getAllByText('Château Test 2020')).toHaveLength(2); // Once in header, once in name field
        expect(screen.getByText('France')).toBeInTheDocument();
        expect(screen.getByText('RED')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
        expect(screen.getByText('1234567890123')).toBeInTheDocument();
        expect(screen.getByText('GOOD')).toBeInTheDocument();
    });

    it('handles wine without optional fields', () => {
        const wineWithoutOptionalFields: GetWineDTO = {
            id: 'test-wine-id',
            name: 'Simple Wine',
            country: 'Italy',
            type: 'WHITE',
            rating: 'OK',
        };

        mockUseWineDetail.mockReturnValue({
            wine: wineWithoutOptionalFields,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getAllByText('Simple Wine')).toHaveLength(2); // Once in header, once in name field
        expect(screen.getByText('Italy')).toBeInTheDocument();
        expect(screen.getByText('WHITE')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
        
        // Should not show vintage year or barcode sections
        expect(screen.queryByText('Vintage Year')).not.toBeInTheDocument();
        expect(screen.queryByText('Barcode')).not.toBeInTheDocument();
    });

    it('applies correct rating badge styles', () => {
        const wineWithGoodRating: GetWineDTO = {
            ...mockWineData,
            rating: 'GOOD',
        };

        mockUseWineDetail.mockReturnValue({
            wine: wineWithGoodRating,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        const ratingBadge = screen.getByText('GOOD');
        expect(ratingBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('shows action buttons', () => {
        mockUseWineDetail.mockReturnValue({
            wine: mockWineData,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('calls useWineDetail with correct wine ID from params', () => {
        mockUseParams.mockReturnValue({ id: 'specific-wine-id' });
        mockUseWineDetail.mockReturnValue({
            wine: mockWineData,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(mockUseWineDetail).toHaveBeenCalledWith('specific-wine-id');
    });

    it('handles different rating colors correctly', () => {
        const testCases = [
            { rating: 'GOOD' as const, expectedClasses: ['bg-green-100', 'text-green-800'] },
            { rating: 'OK' as const, expectedClasses: ['bg-yellow-100', 'text-yellow-800'] },
            { rating: 'BAD' as const, expectedClasses: ['bg-red-100', 'text-red-800'] },
        ];

        testCases.forEach(({ rating, expectedClasses }) => {
            const wineWithRating: GetWineDTO = {
                ...mockWineData,
                rating,
            };

            mockUseWineDetail.mockReturnValue({
                wine: wineWithRating,
                isLoading: false,
                error: null,
            });

            const { unmount } = render(<WineDetailPage />);

            const ratingBadge = screen.getByText(rating);
            expectedClasses.forEach(className => {
                expect(ratingBadge).toHaveClass(className);
            });

            unmount();
        });
    });

    it('does not display rating when rating is NONE', () => {
        const wineWithNoneRating: GetWineDTO = {
            ...mockWineData,
            rating: 'NONE',
        };

        mockUseWineDetail.mockReturnValue({
            wine: wineWithNoneRating,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.queryByText('NONE')).not.toBeInTheDocument();
    });

    it('displays vintage year when available', () => {
        mockUseWineDetail.mockReturnValue({
            wine: mockWineData,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getByText('Vintage Year')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
    });

    it('displays barcode when available', () => {
        mockUseWineDetail.mockReturnValue({
            wine: mockWineData,
            isLoading: false,
            error: null,
        });

        render(<WineDetailPage />);

        expect(screen.getByText('Barcode')).toBeInTheDocument();
        expect(screen.getByText('1234567890123')).toBeInTheDocument();
    });
});