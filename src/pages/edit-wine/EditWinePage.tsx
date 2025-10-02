import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { FormField } from '../../components/form-field/FormField';
import { Button } from '../../components/button/Button';
import { useEditWine } from './hooks/useEditWine';
import { WineType, WineRating } from '../../types/wine';

const EditWinePage: React.FC = () => {
    const { id } = useParams({ strict: false });
    const navigate = useNavigate();
    const {
        formData,
        errors,
        isLoadingWine,
        isSubmitting,
        submitError,
        wine,
        wineLoadError,
        handleInputChange,
        handleSubmit,
    } = useEditWine(id as string);

    if (isLoadingWine) {
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

    if (wineLoadError || !wine) {
        return (
            <PageLayout>
                <Card>
                    <PageHeader
                        title="Wine Not Found"
                        subtitle="The wine you're trying to edit could not be found"
                    />
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-800 mb-4">
                            {wineLoadError || 'Wine not found'}
                        </p>
                        <Button onClick={() => navigate({ to: '/wines/search' })}>
                            Back to Search
                        </Button>
                    </div>
                </Card>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Card>
                <PageHeader
                    title={`Edit ${wine.name}`}
                    subtitle="Update wine information"
                />

                <div className="space-y-6">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">
                                Failed to update wine. Please try again.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label="Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter wine name"
                            required
                            error={errors.name}
                        />

                        <FormField
                            label="Country"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Enter country"
                            required
                            error={errors.country}
                        />

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                Type *
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.type ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">Select wine type</option>
                                <option value={WineType.RED}>Red Wine</option>
                                <option value={WineType.WHITE}>White Wine</option>
                                <option value={WineType.SPARKLING}>Sparkling Wine</option>
                                <option value={WineType.ROSE}>Rosé Wine</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                            )}
                        </div>

                        <FormField
                            label="Vintage Year"
                            type="number"
                            name="vintageYear"
                            value={formData.vintageYear}
                            onChange={handleInputChange}
                            placeholder="Enter vintage year (optional)"
                            error={errors.vintageYear}
                        />

                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                            </label>
                            <select
                                id="rating"
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={WineRating.NONE}>No Rating</option>
                                <option value={WineRating.GOOD}>Good</option>
                                <option value={WineRating.OK}>OK</option>
                                <option value={WineRating.BAD}>Bad</option>
                            </select>
                        </div>

                        <FormField
                            label="Barcode"
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleInputChange}
                            placeholder="Enter barcode (optional)"
                        />

                        <div className="flex gap-4">
                            <Button type="submit" loading={isSubmitting}>
                                {isSubmitting ? 'Updating Wine...' : 'Update Wine'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate({ to: `/wines/${id}` })}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </PageLayout>
    );
};

export { EditWinePage };
