import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import type {
    WineFormData,
    WineFormErrors,
    CreateWineDTO,
    ExternalWineSearchResult,
} from '../../../types/wine';
import { WineType, WineRating } from '../../../types/wine';
import { createWine, getExternalWineByBarcode } from '../../../services/wineApi';

export interface UseAddWineFormReturn {
    formData: WineFormData;
    errors: WineFormErrors;
    isSubmitting: boolean;
    isLoadingExternal: boolean;
    externalWineResult: ExternalWineSearchResult | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    validateForm: () => boolean;
    resetForm: () => void;
}

const useAddWineForm = (): UseAddWineFormReturn => {
    const search = useSearch({ from: '/wines/add' });
    const initialBarcode = search.barcode || '';

    const [formData, setFormData] = useState<WineFormData>({
        name: '',
        country: '',
        vintageYear: '',
        type: '' as WineType | '',
        rating: WineRating.NONE,
        barcode: initialBarcode,
    });

    const [errors, setErrors] = useState<WineFormErrors>({});
    const [externalWineResult, setExternalWineResult] = useState<ExternalWineSearchResult | null>(
        null
    );

    // Auto-fetch external wine data when barcode is present
    useEffect(() => {
        if (initialBarcode && !externalWineResult) {
            fetchExternalWineData(initialBarcode);
        }
    }, [initialBarcode]);

    const createWineMutation = useMutation({
        mutationFn: createWine,
        onSuccess: () => {
            alert('Wine added to your collection successfully!');
            // TODO: Navigate to wine details or collection page
            resetForm();
        },
        onError: (error: Error) => {
            console.error('Add wine error:', error);
            alert(`Failed to add wine: ${error.message}`);
        },
    });

    const externalWineMutation = useMutation({
        mutationFn: getExternalWineByBarcode,
        onSuccess: externalWine => {
            setExternalWineResult({
                wine: externalWine,
                found: true,
            });

            // Prefill form with external wine data
            setFormData(prev => ({
                ...prev,
                name: externalWine.name || prev.name,
                country: externalWine.country || prev.country,
                // Note: external wine type might need mapping
                type: prev.type, // Keep existing selection for now
            }));
        },
        onError: (error: Error) => {
            console.log('External wine not found:', error.message);
            setExternalWineResult({
                found: false,
            });
        },
    });

    const fetchExternalWineData = async (barcode: string) => {
        if (barcode.trim()) {
            await externalWineMutation.mutateAsync(barcode);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof WineFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: WineFormErrors = {};

        // Required fields
        if (!formData.name.trim()) {
            newErrors.name = 'Wine name is required';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        if (!formData.type) {
            newErrors.type = 'Wine type is required';
        }

        // Vintage year validation (optional but must be 4 digits if provided)
        if (formData.vintageYear) {
            const yearString = formData.vintageYear.toString();
            if (!/^\d{4}$/.test(yearString)) {
                newErrors.vintageYear = 'Vintage year must be exactly 4 digits';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Convert form data to API format
        const wineData: CreateWineDTO = {
            name: formData.name.trim(),
            country: formData.country.trim(),
            type: formData.type as WineType,
            rating: formData.rating,
            barcode: formData.barcode.trim() || undefined,
        };

        // Add vintage year if provided
        if (formData.vintageYear) {
            wineData.vintage_year = parseInt(formData.vintageYear, 10);
        }

        await createWineMutation.mutateAsync(wineData);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            country: '',
            vintageYear: '',
            type: '' as WineType | '',
            rating: WineRating.NONE,
            barcode: '',
        });
        setErrors({});
        setExternalWineResult(null);
    };

    return {
        formData,
        errors,
        isSubmitting: createWineMutation.isPending,
        isLoadingExternal: externalWineMutation.isPending,
        externalWineResult,
        handleInputChange,
        handleSubmit,
        validateForm,
        resetForm,
    };
};

export { useAddWineForm };
