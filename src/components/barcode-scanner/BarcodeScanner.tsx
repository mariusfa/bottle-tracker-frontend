import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isActive) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isActive]);

    const startScanner = () => {
        if (scannerRef.current) {
            return; // Scanner already running
        }

        try {
            scannerRef.current = new Html5QrcodeScanner(
                'barcode-scanner',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    formatsToSupport: [
                        // Common barcode formats
                        0, // QR_CODE
                        8, // CODE_128
                        9, // CODE_39
                        12, // EAN_13
                        13, // EAN_8
                        14, // UPC_A
                        15  // UPC_E
                    ]
                },
                false
            );

            scannerRef.current.render(
                (decodedText: string) => {
                    onScan(decodedText);
                },
                (error: string) => {
                    // Only report actual errors, not scanning attempts
                    if (error.includes('NotFoundException')) {
                        return; // Normal scanning state
                    }
                    onError?.(error);
                }
            );

            setIsReady(true);
        } catch (error) {
            onError?.(`Failed to start scanner: ${error}`);
        }
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            try {
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsReady(false);
            } catch (error) {
                console.warn('Error stopping scanner:', error);
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {isActive ? (
                <div>
                    <div id="barcode-scanner" className="rounded-lg overflow-hidden"></div>
                    {!isReady && (
                        <div className="text-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Starting camera...</p>
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