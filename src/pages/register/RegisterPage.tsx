import React from 'react';
import { useRegisterForm } from './hooks/useRegisterForm';
import { FormField } from '../../components/form-field/FormField';
import { Button } from '../../components/button/Button';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';

const RegisterPage: React.FC = () => {
    const {
        formData,
        errors,
        isSubmitting,
        handleInputChange,
        handleSubmit
    } = useRegisterForm();

    return (
        <PageLayout>
            <Card>
                <PageHeader
                    title="Create Account"
                    subtitle="Join Bottle Tracker to manage your wine collection"
                />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            error={errors.name}
                        />

                        <FormField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            error={errors.password}
                        />

                        <FormField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            error={errors.confirmPassword}
                        />

                        <Button
                            type="submit"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign in here
                            </a>
                        </p>
                    </div>
            </Card>
        </PageLayout>
    );
};

export { RegisterPage };