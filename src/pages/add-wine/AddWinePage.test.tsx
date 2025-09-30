import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AddWinePage } from './AddWinePage';
import { WineType, WineRating } from '../../types/wine';

// Mock TanStack Router hooks
vi.mock('@tanstack/react-router', () => ({
    useSearch: vi.fn(),
}));

// Mock the useAddWineForm hook for isolated component testing
vi.mock('./hooks/useAddWineForm', () => ({
    useAddWineForm: vi.fn(),
}));

import { useAddWineForm } from './hooks/useAddWineForm';

const mockUseAddWineForm = vi.mocked(useAddWineForm);

const renderAddWinePage = (hookReturnValue: ReturnType<typeof useAddWineForm>) => {
    mockUseAddWineForm.mockReturnValue(hookReturnValue);
    return render(<AddWinePage />);
};

describe('AddWinePage', () => {
    const defaultHookReturn = {
        formData: {
            name: '',
            country: '',
            vintageYear: '',
            type: '' as WineType | '',
            rating: WineRating.NONE,
            barcode: '',
        },
        errors: {},
        isSubmitting: false,
        submitError: false,
        isLoadingExternal: false,
        externalWineResult: null,
        handleInputChange: vi.fn(),
        handleSubmit: vi.fn(),
        validateForm: vi.fn(),
        resetForm: vi.fn(),
    };

    it('renders add wine form with all fields', () => {
        renderAddWinePage(defaultHookReturn);

        expect(screen.getByRole('heading', { name: /add new wine/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
        const typeSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'type');
        expect(typeSelect).toBeInTheDocument();
        expect(screen.getByLabelText(/vintage year/i)).toBeInTheDocument();
        const ratingSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'rating');
        expect(ratingSelect).toBeInTheDocument();
        expect(screen.getByLabelText(/barcode/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add wine/i })).toBeInTheDocument();
    });

    it('displays form values from hook', () => {
        const hookReturn = {
            ...defaultHookReturn,
            formData: {
                name: 'Bordeaux 2020',
                country: 'France',
                vintageYear: '2020',
                type: WineType.RED,
                rating: WineRating.GOOD,
                barcode: '123456789',
            },
        };
        renderAddWinePage(hookReturn);

        expect(screen.getByDisplayValue('Bordeaux 2020')).toBeInTheDocument();
        expect(screen.getByDisplayValue('France')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2020')).toBeInTheDocument();
        const typeSelects = screen.getAllByRole('combobox');
        const typeSelect = typeSelects.find(select => select.getAttribute('name') === 'type');
        expect(typeSelect).toHaveValue(WineType.RED);
        const ratingSelect = typeSelects.find(select => select.getAttribute('name') === 'rating');
        expect(ratingSelect).toHaveValue(WineRating.GOOD);
        expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
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
        renderAddWinePage(hookReturn);

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
        renderAddWinePage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        await user.type(nameInput, 'Test Wine');

        expect(handleInputChange).toHaveBeenCalledTimes(9); // One for each character
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
        renderAddWinePage(hookReturn);

        const typeSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'type');
        await user.selectOptions(typeSelect!, WineType.RED);

        expect(handleInputChange).toHaveBeenCalled();
        const calls = handleInputChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.target.name).toBe('type');
        // Just check that the function was called with the right element
        expect(lastCall.target).toBe(typeSelect);
    });

    it('calls handleInputChange when selecting wine rating', async () => {
        const user = userEvent.setup();
        const handleInputChange = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleInputChange,
        };
        renderAddWinePage(hookReturn);

        const ratingSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'rating');
        await user.selectOptions(ratingSelect!, WineRating.GOOD);

        expect(handleInputChange).toHaveBeenCalled();
        const calls = handleInputChange.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        expect(lastCall.target.name).toBe('rating');
        // Just check that the function was called with the right element
        expect(lastCall.target).toBe(ratingSelect);
    });

    it('calls handleSubmit when form is submitted', async () => {
        const handleSubmit = vi.fn();
        const hookReturn = {
            ...defaultHookReturn,
            handleSubmit,
        };
        renderAddWinePage(hookReturn);

        const form = screen.getByRole('button', { name: /add wine/i }).closest('form');
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
        renderAddWinePage(hookReturn);

        const submitButton = screen.getByRole('button', { name: /adding wine.../i });
        expect(submitButton).toBeDisabled();
    });

    it('applies error styling to fields with errors', () => {
        const hookReturn = {
            ...defaultHookReturn,
            errors: { name: 'Wine name is required', type: 'Wine type is required' },
        };
        renderAddWinePage(hookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        const typeSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'type');

        expect(nameInput).toHaveClass('border-red-500');
        expect(typeSelect).toHaveClass('border-red-500');
    });

    it('applies normal styling to fields without errors', () => {
        renderAddWinePage(defaultHookReturn);

        const nameInput = screen.getByLabelText(/name/i);
        const typeSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'type');

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
        renderAddWinePage(hookReturn);

        expect(screen.getByText('Failed to add wine. Please try again.')).toBeInTheDocument();
        expect(screen.getByText('Failed to add wine. Please try again.')).toHaveClass(
            'text-red-800'
        );
    });

    it('does not display error UI when no submit error', () => {
        renderAddWinePage(defaultHookReturn);

        expect(screen.queryByText(/failed to add wine/i)).not.toBeInTheDocument();
    });

    it('shows external wine loading state', () => {
        const hookReturn = {
            ...defaultHookReturn,
            isLoadingExternal: true,
        };
        renderAddWinePage(hookReturn);

        expect(screen.getByText('Looking up wine information...')).toBeInTheDocument();
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('displays found external wine information', () => {
        const hookReturn = {
            ...defaultHookReturn,
            externalWineResult: {
                found: true,
                wine: {
                    name: 'External Wine',
                    country: 'Italy',
                    type: 'Red',
                    price: 150,
                    volume: 750,
                },
            },
        };
        renderAddWinePage(hookReturn);

        expect(screen.getByText('Wine Information Found! 🍷')).toBeInTheDocument();
        expect(screen.getByText('External Wine')).toBeInTheDocument();
        expect(screen.getByText('Italy')).toBeInTheDocument();
        expect(screen.getByText('Red')).toBeInTheDocument();
        expect(screen.getByText('150 kr')).toBeInTheDocument();
        expect(screen.getByText('750 ml')).toBeInTheDocument();
    });

    it('displays message when external wine not found', () => {
        const hookReturn = {
            ...defaultHookReturn,
            externalWineResult: {
                found: false,
            },
        };
        renderAddWinePage(hookReturn);

        expect(screen.getByText('No External Information Found')).toBeInTheDocument();
        expect(screen.getByText('Please fill in the wine details manually.')).toBeInTheDocument();
    });

    it('displays barcode in subtitle when barcode is present', () => {
        const hookReturn = {
            ...defaultHookReturn,
            formData: {
                ...defaultHookReturn.formData,
                barcode: '123456789',
            },
        };
        renderAddWinePage(hookReturn);

        expect(screen.getByText('Adding wine with barcode: 123456789')).toBeInTheDocument();
    });

    it('displays default subtitle when no barcode', () => {
        renderAddWinePage(defaultHookReturn);

        expect(screen.getByText('Add a wine to your collection')).toBeInTheDocument();
    });

    it('renders all wine type options', () => {
        renderAddWinePage(defaultHookReturn);

        const typeSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'type');

        expect(typeSelect).toContainHTML('<option value="">Select wine type</option>');
        expect(typeSelect).toContainHTML(`<option value="${WineType.RED}">Red Wine</option>`);
        expect(typeSelect).toContainHTML(`<option value="${WineType.WHITE}">White Wine</option>`);
        expect(typeSelect).toContainHTML(`<option value="${WineType.SPARKLING}">Sparkling Wine</option>`);
        expect(typeSelect).toContainHTML(`<option value="${WineType.ROSE}">Rosé Wine</option>`);
    });

    it('renders all wine rating options', () => {
        renderAddWinePage(defaultHookReturn);

        const ratingSelect = screen.getAllByRole('combobox').find(select => select.getAttribute('name') === 'rating');

        expect(ratingSelect).toContainHTML(`<option value="${WineRating.NONE}">No Rating</option>`);
        expect(ratingSelect).toContainHTML(`<option value="${WineRating.GOOD}">Good</option>`);
        expect(ratingSelect).toContainHTML(`<option value="${WineRating.OK}">OK</option>`);
        expect(ratingSelect).toContainHTML(`<option value="${WineRating.BAD}">Bad</option>`);
    });
});