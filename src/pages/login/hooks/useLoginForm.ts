import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { loginUser } from '../../../services/userApi';
import { authService } from '../../../services/authService';

interface LoginUserRequest {
    name: string;
    password: string;
}

export interface LoginFormData {
    name: string;
    password: string;
}

export interface LoginFormErrors {
    name?: string;
    password?: string;
}

export interface UseLoginFormReturn {
    formData: LoginFormData;
    errors: LoginFormErrors;
    generalError: boolean;
    isSubmitting: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    validateForm: () => boolean;
}

interface UseLoginFormProps {
    initialUsername?: string;
}

const useLoginForm = ({ initialUsername = '' }: UseLoginFormProps = {}): UseLoginFormReturn => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        name: initialUsername,
        password: '',
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [generalError, setGeneralError] = useState<boolean>(false);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: response => {
            authService.setToken(response.token);
            navigate({ to: '/' });
        },
        onError: (error: Error) => {
            if (error.message.includes('500') || error.message.includes('failed')) {
                setErrors({ password: 'Invalid username or password' });
            } else {
                setGeneralError(true);
            }
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear field error when user starts typing
        if (errors[name as keyof LoginFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Clear general error when user starts typing
        if (generalError) {
            setGeneralError(false);
        }
    };

    const validateForm = () => {
        const newErrors: LoginFormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData: LoginUserRequest = {
            name: formData.name.trim(),
            password: formData.password,
        };

        loginMutation.mutate(userData);
    };

    return {
        formData,
        errors,
        generalError,
        isSubmitting: loginMutation.isPending,
        handleInputChange,
        handleSubmit,
        validateForm,
    };
};

export { useLoginForm };
