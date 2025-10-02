import { createFileRoute } from '@tanstack/react-router';
import { EditWinePage } from '../../pages/edit-wine/EditWinePage';

export const Route = createFileRoute('/edit-wine/$id')({
    component: EditWinePage,
});
