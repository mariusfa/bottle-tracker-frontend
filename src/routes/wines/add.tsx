import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { AddWinePage } from '../../pages/add-wine/AddWinePage';

const addWineSearchSchema = z.object({
    barcode: z.coerce.string().optional(),
});

export const Route = createFileRoute('/wines/add')({
    component: AddWinePage,
    validateSearch: addWineSearchSchema,
});
