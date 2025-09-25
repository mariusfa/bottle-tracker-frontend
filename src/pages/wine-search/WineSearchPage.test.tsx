import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WineSearchPage } from './WineSearchPage';
import { useWineSearch } from './hooks/useWineSearch';
import type { GetWineDTO, WineSearchResult } from '../../types/wine';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
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
        <a href={params ? `${to.replace('$id', params.id)}` : to} className={className}>
            {children}
        </a>
    ),
}));

// Mock the useWineSearch hook
vi.mock('./hooks/useWineSearch', () => ({
    useWineSearch: vi.fn(),
}));

// Mock BarcodeScanner component
vi.mock('../../components/barcode-scanner/BarcodeScanner', () => ({
    BarcodeScanner: ({ 
        isActive, 
        onScan
    }: { 
        isActive: boolean; 
        onScan: (barcode: string) => void;
    }) => (
        <div data-testid="barcode-scanner">
            {isActive ? (
                <div>
                    <p>Scanner is active</p>
                    <button 
                        data-testid="mock-scan-button"
                        onClick={() => onScan('1234567890')}
                    >
                        Mock Scan
                    </button>
                </div>
            ) : (
                <p>Scanner is inactive</p>
            )}
        </div>
    ),
}));

const mockUseWineSearch = vi.mocked(useWineSearch);

const mockWineData: GetWineDTO[] = [
    {
        id: 'wine-1',
        name: 'Château Test 2020',
        country: 'France',
        vintage_year: 2020,
        type: 'RED',
        rating: 'GOOD',
        barcode: '1234567890',
    },
    {
        id: 'wine-2',
        name: 'Barolo Riserva',
        country: 'Italy',
        type: 'RED',
        rating: 'GOOD',
        barcode: '1234567890',
    },
];

describe('WineSearchPage', () => {
    const mockSearchByBarcode = vi.fn();
    const mockClearSearch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseWineSearch.mockReturnValue({
            searchResult: null,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });
    });

    it('renders search page with title and scanner section', () => {
        render(<WineSearchPage />);

        expect(screen.getByRole('heading', { name: 'Search Wine' })).toBeInTheDocument();
        expect(screen.getByText('Scan a barcode or enter manually to find wine in your collection')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Start Barcode Scanner' })).toBeInTheDocument();
    });

    it('renders manual barcode entry form', () => {
        render(<WineSearchPage />);

        expect(screen.getByText('Or enter barcode manually:')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter barcode number')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('starts barcode scanner when button is clicked', async () => {
        const user = userEvent.setup();
        render(<WineSearchPage />);

        const startButton = screen.getByRole('button', { name: 'Start Barcode Scanner' });
        await user.click(startButton);

        expect(screen.getByText('Scanner Active')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Stop Scanner' })).toBeInTheDocument();
        expect(screen.getByTestId('barcode-scanner')).toBeInTheDocument();
    });

    it('handles manual barcode search', async () => {
        const user = userEvent.setup();
        render(<WineSearchPage />);

        const barcodeInput = screen.getByPlaceholderText('Enter barcode number');
        const searchButton = screen.getByRole('button', { name: 'Search' });

        await user.type(barcodeInput, '1234567890');
        await user.click(searchButton);

        expect(mockSearchByBarcode).toHaveBeenCalledWith('1234567890');
    });

    it('disables search button when input is empty', () => {
        render(<WineSearchPage />);

        const searchButton = screen.getByRole('button', { name: 'Search' });
        expect(searchButton).toBeDisabled();
    });

    it('shows loading state during search', () => {
        mockUseWineSearch.mockReturnValue({
            searchResult: null,
            isSearching: true,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        expect(screen.getByRole('button', { name: 'Searching...' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();
    });

    it('displays search results with multiple wines', () => {
        const searchResult: WineSearchResult = {
            wines: mockWineData,
            found: true,
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        expect(screen.getByText('2 Wines Found in Your Collection! 🍷')).toBeInTheDocument();
        expect(screen.getByText('Wine 1')).toBeInTheDocument();
        expect(screen.getByText('Wine 2')).toBeInTheDocument();
        expect(screen.getByText('Château Test 2020')).toBeInTheDocument();
        expect(screen.getByText('Barolo Riserva')).toBeInTheDocument();
    });

    it('displays search results with single wine', () => {
        const searchResult: WineSearchResult = {
            wines: [mockWineData[0]],
            found: true,
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        expect(screen.getByText('Wine Found in Your Collection! 🍷')).toBeInTheDocument();
        expect(screen.queryByText('Wine 1')).not.toBeInTheDocument(); // No numbering for single wine
        expect(screen.getByText('Château Test 2020')).toBeInTheDocument();
    });

    it('shows view details buttons for each wine result', () => {
        const searchResult: WineSearchResult = {
            wines: mockWineData,
            found: true,
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        const viewDetailsButtons = screen.getAllByRole('link', { name: 'View Details' });
        expect(viewDetailsButtons).toHaveLength(2);
        expect(viewDetailsButtons[0]).toHaveAttribute('href', '/wines/wine-1');
        expect(viewDetailsButtons[1]).toHaveAttribute('href', '/wines/wine-2');
    });

    it('displays no results found message', () => {
        const searchResult: WineSearchResult = {
            wines: [],
            found: false,
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        expect(screen.getByText('Wine Not Found in Your Collection')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Add This Wine' })).toBeInTheDocument();
    });

    it('displays error state from search result', () => {
        const searchResult: WineSearchResult = {
            wines: [],
            found: false,
            error: 'Network error occurred',
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        expect(screen.getByText('Search Error')).toBeInTheDocument();
        expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    it('displays general error when no search result', () => {
        mockUseWineSearch.mockReturnValue({
            searchResult: null,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: 'Connection failed',
        });

        render(<WineSearchPage />);

        expect(screen.getByText('Connection Error')).toBeInTheDocument();
        expect(screen.getByText('Unable to search wines: Connection failed')).toBeInTheDocument();
    });

    it('handles barcode scanner scan event', async () => {
        const user = userEvent.setup();
        render(<WineSearchPage />);

        // Start scanner
        await user.click(screen.getByRole('button', { name: 'Start Barcode Scanner' }));

        // Mock scan
        await user.click(screen.getByTestId('mock-scan-button'));

        expect(mockSearchByBarcode).toHaveBeenCalledWith('1234567890');
        expect(screen.queryByText('Scanner Active')).not.toBeInTheDocument(); // Scanner should stop
    });

    it('clears search and resets form when search again is clicked', async () => {
        const user = userEvent.setup();
        const searchResult: WineSearchResult = {
            wines: [mockWineData[0]],
            found: true,
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        const searchAgainButton = screen.getByRole('button', { name: 'Search Again' });
        await user.click(searchAgainButton);

        expect(mockClearSearch).toHaveBeenCalled();
    });

    it('prevents form submission with empty barcode', async () => {
        const user = userEvent.setup();
        render(<WineSearchPage />);

        const form = screen.getByRole('button', { name: 'Search' }).closest('form');
        expect(form).toBeInTheDocument();

        // Try to submit with empty input
        await user.click(screen.getByRole('button', { name: 'Search' }));
        
        // Should not call search function since button is disabled
        expect(mockSearchByBarcode).not.toHaveBeenCalled();
    });

    it('handles form submission with enter key', async () => {
        const user = userEvent.setup();
        render(<WineSearchPage />);

        const barcodeInput = screen.getByPlaceholderText('Enter barcode number');
        await user.type(barcodeInput, '1234567890');
        
        // Submit form with enter key
        fireEvent.submit(barcodeInput.closest('form')!);

        expect(mockSearchByBarcode).toHaveBeenCalledWith('1234567890');
    });

    it('displays wine information correctly in search results', () => {
        const wineWithAllFields: GetWineDTO = {
            id: 'complete-wine',
            name: 'Complete Wine',
            country: 'Spain',
            vintage_year: 2018,
            type: 'WHITE',
            rating: 'OK',
            barcode: '9876543210',
        };

        const searchResult: WineSearchResult = {
            wines: [wineWithAllFields],
            found: true,
        };

        mockUseWineSearch.mockReturnValue({
            searchResult,
            isSearching: false,
            searchByBarcode: mockSearchByBarcode,
            clearSearch: mockClearSearch,
            error: undefined,
        });

        render(<WineSearchPage />);

        expect(screen.getByText('Complete Wine')).toBeInTheDocument();
        expect(screen.getByText('Spain')).toBeInTheDocument();
        expect(screen.getByText('WHITE')).toBeInTheDocument();
        expect(screen.getByText('OK')).toBeInTheDocument();
        expect(screen.getByText('2018')).toBeInTheDocument();
        expect(screen.getByText('9876543210')).toBeInTheDocument();
    });
});