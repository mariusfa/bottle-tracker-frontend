import { FunctionalComponent } from 'preact';

interface Props {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
}

export const PrimaryButton: FunctionalComponent<Props> = ({ label, onClick, type = "button" }) => {
    return (
        <button
            class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type={type}
            onClick={onClick}
        >
            {label}
        </button>
    );
}