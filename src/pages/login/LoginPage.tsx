import React from 'react';
import { useSearch, Link } from '@tanstack/react-router';
import { useLoginForm } from './hooks/useLoginForm';
import { FormField } from '../../components/form-field/FormField';
import { Button } from '../../components/button/Button';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';

const LoginPage: React.FC = () => {
    const search = useSearch({ from: '/login' });
    const initialUsername = search.username || '';

    const { formData, errors, generalError, isSubmitting, handleInputChange, handleSubmit } =
        useLoginForm({ initialUsername });

    return (
        <PageLayout>
            <Card>
                <PageHeader
                    title="Welcome Back"
                    subtitle="Sign in to your Bottle Tracker account"
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

                    {generalError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {generalError}
                        </div>
                    )}

                    <Button type="submit" loading={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create one here
                        </Link>
                    </p>
                </div>
            </Card>
        </PageLayout>
    );
};

export { LoginPage };
