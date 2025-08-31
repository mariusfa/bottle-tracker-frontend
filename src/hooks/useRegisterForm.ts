import { useState } from 'react';

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
    isSubmitting: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    validateForm: () => boolean;
}

const useRegisterForm = (): UseRegisterFormReturn => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof RegisterFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: RegisterFormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
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

        setIsSubmitting(true);
        
        try {
            // TODO: Send registration request to API
            console.log('Registration data:', {
                name: formData.name.trim(),
                password: formData.password
            });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Registration successful! (Mock response)');
        } catch (error) {
            console.error('Registration error:', error);
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

export { useRegisterForm };