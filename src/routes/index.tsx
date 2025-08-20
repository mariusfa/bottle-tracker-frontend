import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

const IndexPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to Bottle Tracker
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Track your wine bottles across multiple fridges with ease.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Register Bottles
                                </h3>
                                <p className="text-gray-600">
                                    Add bottles manually or by scanning barcodes
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Manage Fridges
                                </h3>
                                <p className="text-gray-600">
                                    Organize bottles across multiple wine fridges
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Track Inventory
                                </h3>
                                <p className="text-gray-600">
                                    Get an overview of all your bottles and locations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/')({
    component: IndexPage,
});
