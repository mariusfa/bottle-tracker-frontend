import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { Button } from '../../components/button/Button';
import { RatingBadge } from '../../components/rating-badge/RatingBadge';
import { useWineDetail } from './hooks/useWineDetail';

const WineDetailPage: React.FC = () => {
    const { id } = useParams({ strict: false });
    const { wine, isLoading, error } = useWineDetail(id as string);

    if (isLoading) {
        return (
            <PageLayout>
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading wine details...</p>
                    </div>
                </Card>
            </PageLayout>
        );
    }

    if (error || !wine) {
        return (
            <PageLayout>
                <Card>
                    <PageHeader
                        title="Wine Not Found"
                        subtitle="The wine you're looking for could not be found"
                    />
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-800 mb-4">
                            {error || 'Wine not found'}
                        </p>
                        <Link to="/wines/search">
                            <Button>Back to Search</Button>
                        </Link>
                    </div>
                </Card>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Card>
                <PageHeader
                    title={wine.name}
                    subtitle="Wine Details"
                />

                <div className="space-y-6">
                    {/* Wine Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Wine Information
                        </h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="text-sm text-gray-900">{wine.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Country</dt>
                                <dd className="text-sm text-gray-900">{wine.country}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Type</dt>
                                <dd className="text-sm text-gray-900">{wine.type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Rating</dt>
                                <dd className="text-sm text-gray-900">
                                    <RatingBadge rating={wine.rating} />
                                </dd>
                            </div>
                            {wine.vintage_year && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Vintage Year</dt>
                                    <dd className="text-sm text-gray-900">{wine.vintage_year}</dd>
                                </div>
                            )}
                            {wine.barcode && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Barcode</dt>
                                    <dd className="text-sm text-gray-900 font-mono">{wine.barcode}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link to="/wines/search">
                            <Button variant="secondary">Back to Search</Button>
                        </Link>
                        <Link to="/">
                            <Button variant="secondary">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </PageLayout>
    );
};

export { WineDetailPage };