import { useState } from 'react';

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
    isSubmitting: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    validateForm: () => boolean;
}

const useLoginForm = (): UseLoginFormReturn => {
    const [formData, setFormData] = useState<LoginFormData>({
        name: '',
        password: ''
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof LoginFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
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

        setIsSubmitting(true);
        
        try {
            // TODO: Send login request to API
            console.log('Login data:', {
                name: formData.name.trim(),
                password: formData.password
            });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Login successful! (Mock response)');
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleInputChange,
        handleSubmit,
        validateForm
    };
};

export { useLoginForm };