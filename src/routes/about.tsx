import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            About Bottle Tracker
                        </h1>

                        <div className="prose prose-blue max-w-none">
                            <p className="text-lg text-gray-600 mb-6">
                                Bottle Tracker is a web application designed to help wine
                                enthusiasts keep track of their bottle collections across multiple
                                wine fridges.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Register wine bottles manually or by scanning barcodes</li>
                                <li>Organize bottles across multiple wine fridges</li>
                                <li>Track bottle locations and inventory</li>
                                <li>Web-based interface for easy access from any device</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Technology
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Built with modern web technologies:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>
                                    <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS v4
                                </li>
                                <li>
                                    <strong>Routing:</strong> Tanstack Router
                                </li>
                                <li>
                                    <strong>Testing:</strong> Vitest, React Testing Library
                                </li>
                                <li>
                                    <strong>Backend:</strong> Go API (separate service)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/about')({
    component: AboutPage,
});
