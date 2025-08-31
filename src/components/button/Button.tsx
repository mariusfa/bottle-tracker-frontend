import React from 'react';

export interface ButtonProps {
    type?: 'submit' | 'button' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
    type = 'button',
    disabled = false,
    loading = false,
    children,
    onClick,
    variant = 'primary'
}) => {
    const isDisabled = disabled || loading;

    const baseClasses = 'w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
        primary: `text-white focus:ring-blue-500 ${
            isDisabled
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
        }`,
        secondary: `border focus:ring-gray-500 ${
            isDisabled
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`
    };

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {loading && (
                <span className="mr-2">
                    <svg className="animate-spin -ml-1 h-4 w-4 text-current inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            )}
            {children}
        </button>
    );
};

export { Button };