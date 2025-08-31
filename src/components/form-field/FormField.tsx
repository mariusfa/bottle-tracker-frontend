import React from 'react';

export interface FormFieldProps {
    label: string;
    type: 'text' | 'password' | 'email';
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    error,
    id
}) => {
    const fieldId = id || name;

    return (
        <div>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                id={fieldId}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={placeholder}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export { FormField };