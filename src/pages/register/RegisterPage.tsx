import React from 'react';
import { Link } from '@tanstack/react-router';
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
        generalError,
        isSubmitting,
        isSuccess,
        registeredUsername,
        handleInputChange,
        handleSubmit,
    } = useRegisterForm();

    if (isSuccess) {
        return (
            <PageLayout>
                <Card>
                    <PageHeader
                        title="Account Created Successfully!"
                        subtitle={`Welcome to Bottle Tracker, ${registeredUsername}!`}
                    />

                    <div className="text-center space-y-6">
                        <div className="text-green-600 text-6xl mb-4">✓</div>
                        <p className="text-gray-600 text-lg">
                            Your account has been created successfully. You can now sign in to start
                            managing your wine collection.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                search={{ username: registeredUsername || undefined }}
                                className="flex-1 sm:flex-initial"
                            >
                                <Button>Sign In Now</Button>
                            </Link>
                            <Link to="/" className="flex-1 sm:flex-initial">
                                <Button variant="secondary">Back to Home</Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </PageLayout>
        );
    }

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

                    {generalError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {generalError}
                        </div>
                    )}

                    <Button type="submit" loading={isSubmitting}>
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
