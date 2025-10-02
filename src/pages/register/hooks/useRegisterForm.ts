import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../../services/userApi';

interface RegisterUserRequest {
    name: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormErrors {
    name?: string;
    password?: string;
    confirmPassword?: string;
}

export interface UseRegisterFormReturn {
    formData: RegisterFormData;
    errors: RegisterFormErrors;
    generalError: boolean;
    isSubmitting: boolean;
    isSuccess: boolean;
    registeredUsername: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    validateForm: () => boolean;
    resetForm: () => void;
}

const useRegisterForm = (): UseRegisterFormReturn => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [generalError, setGeneralError] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [registeredUsername, setRegisteredUsername] = useState<string | null>(null);

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            setRegisteredUsername(formData.name);
            setIsSuccess(true);
        },
        onError: (error: Error) => {
            if (error.message === 'User already exists') {
                setErrors({ name: 'A user with this name already exists' });
            } else {
                setGeneralError(true);
            }
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Remove spaces from name field
        const processedValue = name === 'name' ? value.replace(/\s/g, '') : value;

        setFormData(prev => ({ ...prev, [name]: processedValue }));

        // Clear field error when user starts typing
        if (errors[name as keyof RegisterFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Clear general error when user starts typing
        if (generalError) {
            setGeneralError(false);
        }
    };

    const validateForm = () => {
        const newErrors: RegisterFormErrors = {};

        // Name validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData: RegisterUserRequest = {
            name: formData.name,
            password: formData.password,
        };

        registerMutation.mutate(userData);
    };

    const resetForm = () => {
        setFormData({ name: '', password: '', confirmPassword: '' });
        setErrors({});
        setGeneralError(false);
        setIsSuccess(false);
        setRegisteredUsername(null);
    };

    return {
        formData,
        errors,
        generalError,
        isSubmitting: registerMutation.isPending,
        isSuccess,
        registeredUsername,
        handleInputChange,
        handleSubmit,
        validateForm,
        resetForm,
    };
};

export { useRegisterForm };
