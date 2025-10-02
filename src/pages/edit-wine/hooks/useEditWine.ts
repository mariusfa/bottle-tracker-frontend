import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { WineFormData, WineFormErrors, GetWineDTO, UpdateWineDTO } from '../../../types/wine';
import { WineType, WineRating } from '../../../types/wine';
import { getWineById, updateWine } from '../../../services/wineApi';

export interface UseEditWineReturn {
    formData: WineFormData;
    errors: WineFormErrors;
    isLoadingWine: boolean;
    isSubmitting: boolean;
    submitError: boolean;
    wine: GetWineDTO | null;
    wineLoadError: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    validateForm: () => boolean;
}

const useEditWine = (wineId: string): UseEditWineReturn => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<WineFormData>({
        name: '',
        country: '',
        vintageYear: '',
        type: '' as WineType | '',
        rating: WineRating.NONE,
        barcode: '',
    });

    const [errors, setErrors] = useState<WineFormErrors>({});
    const [submitError, setSubmitError] = useState<boolean>(false);

    // Fetch wine data
    const {
        data: wine,
        isLoading: isLoadingWine,
        error: wineLoadError,
    } = useQuery({
        queryKey: ['wine', wineId],
        queryFn: () => getWineById(wineId),
        enabled: !!wineId,
        retry: 1,
    });

    // Populate form when wine data is loaded
    useEffect(() => {
        if (wine) {
            setFormData({
                name: wine.name,
                country: wine.country,
                vintageYear: wine.vintage_year?.toString() || '',
                type: wine.type,
                rating: wine.rating,
                barcode: wine.barcode || '',
            });
        }
    }, [wine]);

    // Update wine mutation
    const updateWineMutation = useMutation({
        mutationFn: (wineData: UpdateWineDTO) => updateWine(wineId, wineData),
        onSuccess: () => {
            // Navigate back to wine detail page
            navigate({ to: '/wines/$id', params: { id: wineId } });
        },
        onError: () => {
            setSubmitError(true);
        },
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset submit error when trying again
        setSubmitError(false);

        if (!validateForm()) {
            return;
        }

        // Convert form data to API format
        const wineData: UpdateWineDTO = {
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

        updateWineMutation.mutate(wineData);
    };

    return {
        formData,
        errors,
        isLoadingWine,
        isSubmitting: updateWineMutation.isPending,
        submitError,
        wine: wine || null,
        wineLoadError: wineLoadError?.message || null,
        handleInputChange,
        handleSubmit,
        validateForm,
    };
};

export { useEditWine };
