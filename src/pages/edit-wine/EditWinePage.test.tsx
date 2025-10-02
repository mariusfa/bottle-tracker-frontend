import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { EditWinePage } from './EditWinePage';
import { WineType, WineRating } from '../../types/wine';
import type { GetWineDTO } from '../../types/wine';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
    useParams: vi.fn(),
    useNavigate: vi.fn(),
}));

// Mock the useEditWine hook
vi.mock('./hooks/useEditWine', () => ({
    useEditWine: vi.fn(),
}));

import { useParams, useNavigate } from '@tanstack/react-router';
import { useEditWine } from './hooks/useEditWine';

const mockUseParams = vi.mocked(useParams);
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseEditWine = vi.mocked(useEditWine);

const mockWineData: GetWineDTO = {
    id: 'test-wine-id',
    name: 'Château Margaux',
    country: 'France',
    vintage_year: 2015,
    type: WineType.RED,
    rating: WineRating.GOOD,
    barcode: '1234567890123',
};

const renderEditWinePage = (hookReturnValue: ReturnType<typeof useEditWine>) => {
    mockUseEditWine.mockReturnValue(hookReturnValue);
    return render(<EditWinePage />);
};

describe('EditWinePage', () => {
    const mockNavigate = vi.fn();

    const defaultHookReturn = {
        formData: {
            name: 'Château Margaux',
            country: 'France',
            vintageYear: '2015',
            type: WineType.RED,
            rating: WineRating.GOOD,
            barcode: '1234567890123',
        },
        errors: {},
        isLoadingWine: false,
        isSubmitting: false,
        submitError: false,
        wine: mockWineData,
        wineLoadError: null,
        handleInputChange: vi.fn(),
        handleSubmit: vi.fn(),
        validateForm: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams.mockReturnValue({ id: 'test-wine-id' });
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    it('shows loading state while fetching wine data', () => {
        const hookReturn = {
            ...defaultHookReturn,
            isLoadingWine: true,
            wine: null,
        };
        renderEditWinePage(hookReturn);

        expect(screen.getByText('Loading wine details...')).toBeInTheDocument();
    });

    it('shows error state when wine load fails', () => {
        const hookReturn = {
            ...defaultHookReturn,
            wine: null,
            wineLoadError: 'Failed to load wine',
        };
        renderEditWinePage(hookReturn);

        expect(screen.getByRole('heading', { name: 'Wine Not Found' })).toBeInTheDocument();
        expect(screen.getByText('Failed to load wine')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back to Search' })).toBeInTheDocument();
    });

    it('shows error state when wine is not found', () => {
        const hookReturn = {
            ...defaultHookReturn,
            wine: null,
            wineLoadError: null,
        };
        renderEditWinePage(hookReturn);

        expect(screen.getByRole('heading', { name: 'Wine Not Found' })).toBeInTheDocument();
        expect(screen.getByText('Wine not found')).toBeInTheDocument();
    });

    it('renders edit wine form with all fields when wine is loaded', () => {
        renderEditWinePage(defaultHookReturn);

        expect(screen.getByRole('heading', { name: /edit château margaux/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/vintage year/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/barcode/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /update wine/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('displays pre-filled form values from wine data', () => {
        renderEditWinePage(defaultHookReturn);

        expect(screen.getByDisplayValue('Château Margaux')).toBeInTheDocument();
        expect(screen.getByDisplayValue('France')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2015')).toBeInTheDocument();
        expect(screen.getByLabelText(/type/i)).toHaveValue(WineType.RED);
        expect(screen.getByLabelText(/rating/i)).toHaveValue(WineRating.GOOD);
        expect(screen.getByDisplayValue('1234567890123')).toBeInTheDocument();
    });

    it('displays validation errors from hook', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: {
                name: 'Wine name is required',
                country: 'Country is required',
                type: 'Wine type is required',
                vintageYear: 'Vintage year must be exactly 4 digits',
            },
        };
        renderEditWinePage(hookReturn);

        expect(screen.getByText('Wine name is required')).toBeInTheDocument();
        expect(screen.getByText('Country is required')).toBeInTheDocument();
        expect(screen.getByText('Wine type is required')).toBeInTheDocument();
        expect(screen.getByText('Vintage year must be exactly 4 digits')).toBeInTheDocument();
    });

    it('calls handleInputChange when typing in text fields', async () => {
        const user = userEvent.setup();
        const handleInputChange = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleInputChange,
        };
        renderEditWinePage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        await user.clear(nameInput);
        await user.type(nameInput, 'New Wine');

        expect(handleInputChange).toHaveBeenCalled();
        expect(handleInputChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    name: 'name',
                }),
            })
        );
    });

    it('calls handleInputChange when selecting wine type', async () => {
        const user = userEvent.setup();
        const handleInputChange = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleInputChange,
        };
        renderEditWinePage(hookReturn);

        const typeSelect = screen.getByLabelText(/type/i);
        await user.selectOptions(typeSelect, WineType.WHITE);

        expect(handleInputChange).toHaveBeenCalled();
        const calls = handleInputChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.target.name).toBe('type');
        expect(lastCall.target).toBe(typeSelect);
    });

    it('calls handleInputChange when selecting wine rating', async () => {
        const user = userEvent.setup();
        const handleInputChange = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleInputChange,
        };
        renderEditWinePage(hookReturn);

        const ratingSelect = screen.getByLabelText(/rating/i);
        await user.selectOptions(ratingSelect, WineRating.OK);

        expect(handleInputChange).toHaveBeenCalled();
        const calls = handleInputChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.target.name).toBe('rating');
        expect(lastCall.target).toBe(ratingSelect);
    });

    it('calls handleSubmit when form is submitted', async () => {
        const handleSubmit = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleSubmit,
        };
        renderEditWinePage(hookReturn);

        const form = screen.getByRole('button', { name: /update wine/i }).closest('form');
        fireEvent.submit(form!);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                preventDefault: expect.any(Function),
            })
        );
    });

    it('shows loading state when submitting', () => {
        const hookReturn = {
            ...defaultHookReturn,
            isSubmitting: true,
        };
        renderEditWinePage(hookReturn);

        const submitButton = screen.getByRole('button', { name: /updating wine.../i });
        expect(submitButton).toBeDisabled();
    });

    it('applies error styling to fields with errors', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: { name: 'Wine name is required', type: 'Wine type is required' },
        };
        renderEditWinePage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        const typeSelect = screen.getByLabelText(/type/i);

        expect(nameInput).toHaveClass('border-red-500');
        expect(typeSelect).toHaveClass('border-red-500');
    });

    it('applies normal styling to fields without errors', () => {
        renderEditWinePage(defaultHookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        const typeSelect = screen.getByLabelText(/type/i);

        expect(nameInput).toHaveClass('border-gray-300');
        expect(nameInput).not.toHaveClass('border-red-500');
        expect(typeSelect).toHaveClass('border-gray-300');
        expect(typeSelect).not.toHaveClass('border-red-500');
    });

    it('displays submit error when present', () => {
        const hookReturn = {
            ...defaultHookReturn,
            submitError: true,
        };
        renderEditWinePage(hookReturn);

        expect(screen.getByText('Failed to update wine. Please try again.')).toBeInTheDocument();
        expect(screen.getByText('Failed to update wine. Please try again.')).toHaveClass(
            'text-red-800'
        );
    });

    it('does not display error UI when no submit error', () => {
        renderEditWinePage(defaultHookReturn);

        expect(screen.queryByText(/failed to update wine/i)).not.toBeInTheDocument();
    });

    it('navigates to wine search when clicking back button on error state', async () => {
        const user = userEvent.setup();
        const hookReturn = {
            ...defaultHookReturn,
            wine: null,
            wineLoadError: 'Failed to load wine',
        };
        renderEditWinePage(hookReturn);

        const backButton = screen.getByRole('button', { name: 'Back to Search' });
        await user.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith({ to: '/wines/search' });
    });

    it('navigates to wine detail when clicking cancel button', async () => {
        const user = userEvent.setup();
        renderEditWinePage(defaultHookReturn);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(mockNavigate).toHaveBeenCalledWith({ to: '/wines/test-wine-id' });
    });

    it('renders all wine type options', () => {
        renderEditWinePage(defaultHookReturn);

        const typeSelect = screen.getByLabelText(/type/i);

        expect(typeSelect).toContainHTML('<option value="">Select wine type</option>');
        expect(typeSelect).toContainHTML(`<option value="${WineType.RED}">Red Wine</option>`);
        expect(typeSelect).toContainHTML(`<option value="${WineType.WHITE}">White Wine</option>`);
        expect(typeSelect).toContainHTML(`<option value="${WineType.SPARKLING}">Sparkling Wine</option>`);
        expect(typeSelect).toContainHTML(`<option value="${WineType.ROSE}">Rosé Wine</option>`);
    });

    it('renders all wine rating options', () => {
        renderEditWinePage(defaultHookReturn);

        const ratingSelect = screen.getByLabelText(/rating/i);

        expect(ratingSelect).toContainHTML(`<option value="${WineRating.NONE}">No Rating</option>`);
        expect(ratingSelect).toContainHTML(`<option value="${WineRating.GOOD}">Good</option>`);
        expect(ratingSelect).toContainHTML(`<option value="${WineRating.OK}">OK</option>`);
        expect(ratingSelect).toContainHTML(`<option value="${WineRating.BAD}">Bad</option>`);
    });

    it('calls useEditWine with correct wine ID from params', () => {
        mockUseParams.mockReturnValue({ id: 'specific-wine-id' });
        renderEditWinePage(defaultHookReturn);

        expect(mockUseEditWine).toHaveBeenCalledWith('specific-wine-id');
    });
});
