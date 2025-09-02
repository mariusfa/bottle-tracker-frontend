import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
    onError?: (error: string) => void;
    isActive: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
    onScan, 
    onError, 
    isActive 
}) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const startScanner = useCallback(async () => {
        if (scannerRef.current && isScanning) {
            return; // Scanner already running
        }

        try {
            setIsReady(false);
            scannerRef.current = new Html5Qrcode('barcode-scanner');

            // Configuration for scanning
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            };

            // Success callback
            const qrCodeSuccessCallback = (decodedText: string) => {
                onScan(decodedText);
            };

            // Error callback - only report actual errors
            const qrCodeErrorCallback = (error: string) => {
                if (error.includes('NotFoundException') || error.includes('No MultiFormat Readers')) {
                    return; // Normal scanning state, no barcode found
                }
                console.warn('Scanner error:', error);
            };

            // Start scanning with back camera preference
            await scannerRef.current.start(
                { facingMode: "environment" }, // Prefer back camera
                config,
                qrCodeSuccessCallback,
                qrCodeErrorCallback
            );

            setIsScanning(true);
            setIsReady(true);
        } catch {
            // If back camera fails, try front camera or any available camera
            try {
                if (scannerRef.current) {
                    await scannerRef.current.start(
                        { facingMode: "user" }, // Front camera fallback
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 }
                        },
                        (decodedText: string) => onScan(decodedText),
                        (error: string) => {
                            if (!error.includes('NotFoundException') && !error.includes('No MultiFormat Readers')) {
                                console.warn('Scanner error:', error);
                            }
                        }
                    );
                    setIsScanning(true);
                    setIsReady(true);
                }
            } catch (fallbackError) {
                onError?.(`Failed to start scanner: ${fallbackError}`);
                setIsReady(false);
            }
        }
    }, [onScan, onError, isScanning]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsScanning(false);
                setIsReady(false);
            } catch (error) {
                console.warn('Error stopping scanner:', error);
                // Force cleanup even if stop() fails
                if (scannerRef.current) {
                    try {
                        scannerRef.current.clear();
                    } catch (clearError) {
                        console.warn('Error clearing scanner:', clearError);
                    }
                    scannerRef.current = null;
                }
                setIsScanning(false);
                setIsReady(false);
            }
        }
    }, [isScanning]);

    useEffect(() => {
        if (isActive) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isActive, startScanner, stopScanner]);

    return (
        <div className="w-full max-w-md mx-auto">
            {isActive ? (
                <div>
                    <div id="barcode-scanner" className="rounded-lg overflow-hidden bg-black"></div>
                    {!isReady && (
                        <div className="text-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Starting camera...</p>
                        </div>
                    )}
                    {isReady && (
                        <div className="text-center mt-4">
                            <p className="text-sm text-green-600">📷 Scanner ready - Point camera at barcode</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                    </div>
                    <p className="text-gray-500">Scanner inactive</p>
                </div>
            )}
        </div>
    );
};

export { BarcodeScanner };