import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { WineSearchResult } from '../../../types/wine';
import { searchWineByBarcode } from '../../../services/wineApi';

export interface UseWineSearchReturn {
    searchResult: WineSearchResult | null;
    isSearching: boolean;
    searchByBarcode: (barcode: string) => Promise<void>;
    clearSearch: () => void;
    error?: string;
}

const useWineSearch = (): UseWineSearchReturn => {
    const [searchResult, setSearchResult] = useState<WineSearchResult | null>(null);

    const searchMutation = useMutation({
        mutationFn: searchWineByBarcode,
        onSuccess: (wine) => {
            setSearchResult({
                wine,
                found: true
            });
        },
        onError: (error: Error) => {
            if (error.message === 'Wine not found in collection') {
                // Wine not found in user's collection - this is expected behavior
                setSearchResult({
                    found: false
                });
            } else {
                // Actual error occurred
                console.error('Wine search error:', error);
                setSearchResult({
                    found: false,
                    error: error.message
                });
            }
        },
    });

    const searchByBarcode = async (barcode: string): Promise<void> => {
        setSearchResult(null);
        await searchMutation.mutateAsync(barcode);
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
        error: searchMutation.error?.message
    };
};

export { useWineSearch };