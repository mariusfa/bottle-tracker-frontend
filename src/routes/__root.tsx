import React from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootRoute: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link
                                        to="/"
                                        className="text-2xl font-bold text-blue-700 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        🍷 Bottle Tracker
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <main>
                    <Outlet />
                </main>
            </div>
            <TanStackRouterDevtools />
        </>
    );
};

export const Route = createRootRoute({
    component: RootRoute,
});
