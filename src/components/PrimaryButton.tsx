import { FunctionalComponent } from 'preact';

interface Props {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit";
	isSubmitting?: boolean;
}

export const PrimaryButton: FunctionalComponent<Props> = ({ label, onClick, type = "button", isSubmitting }) => {
    return (
        <button
            class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type={type}
            onClick={onClick}
			disabled={isSubmitting}
        >
            {label}
        </button>
    );
}
