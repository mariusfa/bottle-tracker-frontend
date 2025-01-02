import { FunctionalComponent } from 'preact';

interface Props {
    label: string;
    forInput: string;
}

export const Label: FunctionalComponent<Props> = ({ label, forInput }) => {
    return (
        <label class="block text-gray-700 text-sm font-bold mb-2" for={`${forInput}`}>
            {label}
        </label>
    );
}
