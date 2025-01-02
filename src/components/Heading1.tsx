import { FunctionalComponent } from 'preact';

interface Props {
    title: string;
}

export const Heading1: FunctionalComponent<Props> = ({ title }) => {
    return (
        <h1 class="mb-4 text-gray-700 text-xl font-bold">{title}</h1>
    );
}
