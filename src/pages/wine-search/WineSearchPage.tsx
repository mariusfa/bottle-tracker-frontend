import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { Button } from '../../components/button/Button';
import { FormField } from '../../components/form-field/FormField';
import { BarcodeScanner } from '../../components/barcode-scanner/BarcodeScanner';
import { useWineSearch } from './hooks/useWineSearch';

const WineSearchPage: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');
    const [currentBarcode, setCurrentBarcode] = useState('');
    const { searchResult, isSearching, searchByBarcode, clearSearch, error } = useWineSearch();

    const handleScan = async (barcode: string) => {
        setIsScanning(false);
        setCurrentBarcode(barcode);
        await searchByBarcode(barcode);
    };

    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (manualBarcode.trim()) {
            setCurrentBarcode(manualBarcode.trim());
            await searchByBarcode(manualBarcode.trim());
        }
    };

    const handleStartScanning = () => {
        clearSearch();
        setCurrentBarcode('');
        setIsScanning(true);
    };

    return (
        <PageLayout>
            <Card>
                <PageHeader
                    title="Search Wine"
                    subtitle="Scan a barcode or enter manually to find wine in your collection"
                />

                <div className="space-y-6">
                    {/* Barcode Scanner Section */}
                    <div className="text-center">
                        <div className="mb-4">
                            <Button
                                onClick={handleStartScanning}
                                disabled={isScanning || isSearching}
                                variant={isScanning ? 'secondary' : 'primary'}
                            >
                                {isScanning ? 'Scanner Active' : 'Start Barcode Scanner'}
                            </Button>
                        </div>

                        <BarcodeScanner
                            isActive={isScanning}
                            onScan={handleScan}
                            onError={error => console.error('Scanner error:', error)}
                        />

                        {isScanning && (
                            <div className="mt-4">
                                <Button variant="secondary" onClick={() => setIsScanning(false)}>
                                    Stop Scanner
                                </Button>
                                <p className="text-sm text-gray-500 mt-2">
                                    Point your camera at a barcode
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Manual Barcode Entry */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Or enter barcode manually:
                        </h3>
                        <form onSubmit={handleManualSearch} className="space-y-4">
                            <div>
                                <FormField
                                    label=""
                                    type="text"
                                    name="barcode"
                                    value={manualBarcode}
                                    onChange={e => setManualBarcode(e.target.value)}
                                    placeholder="Enter barcode number"
                                />
                            </div>
                            <div>
                                <Button type="submit" disabled={!manualBarcode.trim() || isSearching}>
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Search Results */}
                    {searchResult && (
                        <div className="border-t pt-6">
                            {searchResult.error ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-red-900 mb-4">
                                        Search Error
                                    </h3>
                                    <p className="text-red-800 mb-4">{searchResult.error}</p>
                                    <div className="text-sm text-red-700">
                                        <p>
                                            <strong>Barcode searched:</strong> {currentBarcode}
                                        </p>
                                    </div>
                                </div>
                            ) : searchResult.found && searchResult.wines.length > 0 ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                                        {searchResult.wines.length === 1 
                                            ? 'Wine Found in Your Collection! 🍷' 
                                            : `${searchResult.wines.length} Wines Found in Your Collection! 🍷`
                                        }
                                    </h3>
                                    <div className="space-y-4">
                                        {searchResult.wines.map((wine, index) => (
                                            <div key={wine.id} className="border border-green-300 rounded-lg p-4 bg-white">
                                                {searchResult.wines.length > 1 && (
                                                    <h4 className="font-medium text-green-900 mb-2">
                                                        Wine {index + 1}
                                                    </h4>
                                                )}
                                                <div className="space-y-2 text-sm text-green-800">
                                                    <p>
                                                        <strong>Name:</strong> {wine.name}
                                                    </p>
                                                    <p>
                                                        <strong>Country:</strong> {wine.country}
                                                    </p>
                                                    <p>
                                                        <strong>Type:</strong> {wine.type}
                                                    </p>
                                                    {wine.vintage_year && (
                                                        <p>
                                                            <strong>Vintage:</strong>{' '}
                                                            {wine.vintage_year}
                                                        </p>
                                                    )}
                                                    <p>
                                                        <strong>Rating:</strong> {wine.rating}
                                                    </p>
                                                    {wine.barcode && (
                                                        <p>
                                                            <strong>Barcode:</strong>{' '}
                                                            {wine.barcode}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                                        Wine Not Found in Your Collection
                                    </h3>
                                    <p className="text-yellow-800 mb-4">
                                        Barcode <strong>{currentBarcode}</strong> is not in your
                                        collection yet. Would you like to add it?
                                    </p>
                                    <Link to="/wines/add" search={{ barcode: currentBarcode }}>
                                        <Button>Add This Wine</Button>
                                    </Link>
                                </div>
                            )}

                            <div className="mt-4 text-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        clearSearch();
                                        setManualBarcode('');
                                        setCurrentBarcode('');
                                    }}
                                >
                                    Search Again
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Show general error from hook if exists and no search result */}
                    {error && !searchResult && (
                        <div className="border-t pt-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-red-900 mb-4">
                                    Connection Error
                                </h3>
                                <p className="text-red-800 mb-4">Unable to search wines: {error}</p>
                                <p className="text-sm text-red-700">
                                    Please check your internet connection and try again.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </PageLayout>
    );
};

export { WineSearchPage };
