import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { WineSearchResult } from '../../../types/wine';
import { searchWineByBarcode } from '../../../services/wineApi';

export interface UseWineSearchReturn {
    searchResult: WineSearchResult | null;
    isSearching: boolean;
    searchByBarcode: (barcode: string) => void;
    clearSearch: () => void;
    error?: string;
}

const useWineSearch = (): UseWineSearchReturn => {
    const [searchResult, setSearchResult] = useState<WineSearchResult | null>(null);

    const searchMutation = useMutation({
        mutationFn: searchWineByBarcode,
        onSuccess: wines => {
            setSearchResult({
                wines,
                found: wines.length > 0,
            });
        },
        onError: (error: Error) => {
            setSearchResult({
                wines: [],
                found: false,
                error: error.message,
            });
        },
    });

    const searchByBarcode = (barcode: string): void => {
        setSearchResult(null);
        searchMutation.mutate(barcode);
    };

    const clearSearch = () => {
        setSearchResult(null);
        searchMutation.reset();
    };

    return {
        searchResult,
        isSearching: searchMutation.isPending,
        searchByBarcode,
        clearSearch,
        error: searchMutation.error?.message,
    };
};

export { useWineSearch };
