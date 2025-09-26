import { useQuery } from '@tanstack/react-query';
import { getAllUserWines } from '../../../services/wineApi';
import type { GetWineDTO } from '../../../types/wine';

type UseWineCollectionReturn = {
    wines: GetWineDTO[];
    isLoading: boolean;
    error: string | null;
};

const useWineCollection = (): UseWineCollectionReturn => {
    const { data: wines = [], isLoading, error } = useQuery({
        queryKey: ['wines'],
        queryFn: getAllUserWines,
        retry: 1,
    });

    return {
        wines,
        isLoading,
        error: error?.message || null,
    };
};

export { useWineCollection };