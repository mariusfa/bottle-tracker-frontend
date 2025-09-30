import React from 'react';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { FormField } from '../../components/form-field/FormField';
import { Button } from '../../components/button/Button';
import { useAddWineForm } from './hooks/useAddWineForm';
import { WineType, WineRating } from '../../types/wine';

const AddWinePage: React.FC = () => {
    const {
        formData,
        errors,
        isSubmitting,
        submitError,
        isLoadingExternal,
        externalWineResult,
        handleInputChange,
        handleSubmit,
    } = useAddWineForm();

    const barcode = formData.barcode;

    return (
        <PageLayout>
            <Card>
                <PageHeader
                    title="Add New Wine"
                    subtitle={
                        barcode
                            ? `Adding wine with barcode: ${barcode}`
                            : 'Add a wine to your collection'
                    }
                />

                {/* External Wine Info */}
                {isLoadingExternal && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                            <p className="text-blue-800">Looking up wine information...</p>
                        </div>
                    </div>
                )}

                {externalWineResult && !isLoadingExternal && (
                    <div className="mb-6">
                        {externalWineResult.found && externalWineResult.wine ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="text-green-900 font-semibold mb-2">
                                    Wine Information Found! 🍷
                                </h3>
                                <div className="text-sm text-green-800 space-y-1">
                                    <p>
                                        <strong>Name:</strong> {externalWineResult.wine.name}
                                    </p>
                                    <p>
                                        <strong>Country:</strong> {externalWineResult.wine.country}
                                    </p>
                                    <p>
                                        <strong>Type:</strong> {externalWineResult.wine.type}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> {externalWineResult.wine.price} kr
                                    </p>
                                    <p>
                                        <strong>Volume:</strong> {externalWineResult.wine.volume} ml
                                    </p>
                                </div>
                                <p className="text-green-700 text-sm mt-2">
                                    Form has been prefilled with available information.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="text-yellow-900 font-semibold mb-2">
                                    No External Information Found
                                </h3>
                                <p className="text-yellow-800 text-sm">
                                    Please fill in the wine details manually.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-6">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">
                                Failed to add wine. Please try again.
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

                        <Button type="submit" loading={isSubmitting}>
                            {isSubmitting ? 'Adding Wine...' : 'Add Wine'}
                        </Button>
                    </form>
                </div>
            </Card>
        </PageLayout>
    );
};

export { AddWinePage };
