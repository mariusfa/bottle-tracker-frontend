import { createFileRoute } from '@tanstack/react-router';
import { WineCollectionPage } from '../../pages/wine-collection/WineCollectionPage';

export const Route = createFileRoute('/wines/')({
    component: WineCollectionPage,
});