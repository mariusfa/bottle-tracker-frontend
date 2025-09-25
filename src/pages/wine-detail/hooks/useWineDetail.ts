import { useQuery } from '@tanstack/react-query';
import { getWineById } from '../../../services/wineApi';
import type { GetWineDTO } from '../../../types/wine';

export interface UseWineDetailReturn {
    wine: GetWineDTO | undefined;
    isLoading: boolean;
    error: string | null;
}

const useWineDetail = (wineId: string): UseWineDetailReturn => {
    const {
        data: wine,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['wine', wineId],
        queryFn: () => getWineById(wineId),
        enabled: !!wineId,
        retry: 1,
    });

    return {
        wine,
        isLoading,
        error: error?.message || null,
    };
};

export { useWineDetail };