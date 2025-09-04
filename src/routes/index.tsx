import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { WelcomePage } from '../pages/welcome/WelcomePage';
import { HomePage } from '../pages/home/HomePage';

const IndexPage: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <HomePage /> : <WelcomePage />;
};

export const Route = createFileRoute('/')({
    component: IndexPage,
});
