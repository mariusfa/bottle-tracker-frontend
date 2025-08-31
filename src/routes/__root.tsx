import React from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootRoute: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Bottle Tracker
                                    </h1>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        to="/"
                                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                                        activeProps={{
                                            className:
                                                'border-blue-500 text-gray-900 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                                        }}
                                    >
                                        Home
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
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
