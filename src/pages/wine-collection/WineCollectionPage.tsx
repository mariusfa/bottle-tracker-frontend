import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { Button } from '../../components/button/Button';
import { useWineCollection } from './hooks/useWineCollection';

const WineCollectionPage: React.FC = () => {
    const { wines, isLoading, error } = useWineCollection();

    return (
        <PageLayout maxWidth="xl">
            <Card>
                <PageHeader 
                    title="My Wine Collection" 
                    subtitle="View and manage your saved wines" 
                />

                {isLoading && (
                    <div className="text-center py-8">
                        <p>Loading wines...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-600">
                        <p>Error loading wines: {error}</p>
                        <Button 
                            variant="secondary" 
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {!isLoading && !error && wines.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No wines in your collection yet.</p>
                        <Link to="/wines/search">
                            <Button>Search for Wines</Button>
                        </Link>
                    </div>
                )}

                {!isLoading && !error && wines.length > 0 && (
                    <div>
                        <p className="text-gray-600 mb-6">
                            {wines.length} {wines.length === 1 ? 'wine' : 'wines'} in your collection
                        </p>
                        
                        <ul className="space-y-4">
                            {wines.map((wine) => (
                                <li key={wine.id} className="border border-green-300 rounded-lg p-4 bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                                {wine.name}
                                            </h3>
                                            
                                            <div className="space-y-2 text-sm">
                                                <div className="flex">
                                                    <span className="font-medium text-gray-700 w-16">Type:</span>
                                                    <span>{wine.type}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="font-medium text-gray-700 w-16">Year:</span>
                                                    <span>{wine.vintage_year || 'N/A'}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="font-medium text-gray-700 w-16">Country:</span>
                                                    <span>{wine.country}</span>
                                                </div>
                                            </div>

                                            {wine.rating && wine.rating !== 'NONE' && (
                                                <div className="mt-2">
                                                    <span className="font-medium text-gray-700">Rating:</span>
                                                    <span 
                                                        className={`ml-2 inline-block px-2 py-1 rounded text-xs font-medium ${
                                                            wine.rating === 'GOOD' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : wine.rating === 'OK' 
                                                                ? 'bg-yellow-100 text-yellow-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {wine.rating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4">
                                            <Link to="/wines/$id" params={{ id: wine.id }}>
                                                <Button variant="secondary">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>
        </PageLayout>
    );
};

export { WineCollectionPage };