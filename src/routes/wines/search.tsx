import { createFileRoute } from '@tanstack/react-router';
import { WineSearchPage } from '../../pages/wine-search/WineSearchPage';

export const Route = createFileRoute('/wines/search')({
    component: WineSearchPage,
});
