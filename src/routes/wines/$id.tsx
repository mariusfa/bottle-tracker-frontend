import { createFileRoute } from '@tanstack/react-router';
import { WineDetailPage } from '../../pages/wine-detail/WineDetailPage';

export const Route = createFileRoute('/wines/$id')({
    component: WineDetailPage,
});