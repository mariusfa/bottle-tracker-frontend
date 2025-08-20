import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

const BottlesPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Bottles</h1>
                    <p className="text-gray-600 mt-2">Manage your wine bottle collection</p>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 6v8a2 2 0 002 2h6a2 2 0 002-2v-8M7 10V8a4 4 0 118 0v2M7 10h10"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No bottles yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding your first bottle.
                            </p>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Bottle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/bottles')({
    component: BottlesPage,
});
