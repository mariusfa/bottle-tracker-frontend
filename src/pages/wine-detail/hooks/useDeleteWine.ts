import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { deleteWine } from '../../../services/wineApi';

export interface UseDeleteWineReturn {
    deleteWine: () => void;
    isDeleting: boolean;
    error: string | null;
}

const useDeleteWine = (wineId: string): UseDeleteWineReturn => {
    const navigate = useNavigate();

    const deleteMutation = useMutation({
        mutationFn: () => deleteWine(wineId),
        onSuccess: () => {
            // Navigate to wine collection page after successful deletion
            navigate({ to: '/wines' });
        },
    });

    return {
        deleteWine: () => deleteMutation.mutate(),
        isDeleting: deleteMutation.isPending,
        error: deleteMutation.error?.message || null,
    };
};

export { useDeleteWine };
