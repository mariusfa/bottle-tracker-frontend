import { useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    isLoading?: boolean;
    error?: string | null;
    variant?: 'danger' | 'default';
}

export interface ConfirmDialogRef {
    showModal: () => void;
    close: () => void;
}

const ConfirmDialog = forwardRef<ConfirmDialogRef, ConfirmDialogProps>(
    (
        {
            title,
            message,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm,
            isLoading = false,
            error = null,
            variant = 'default',
        },
        ref
    ) => {
        const dialogRef = useRef<HTMLDialogElement>(null);

        useImperativeHandle(ref, () => ({
            showModal: () => {
                dialogRef.current?.showModal();
            },
            close: () => {
                dialogRef.current?.close();
            },
        }));

        const handleConfirm = () => {
            onConfirm();
        };

        const handleCancel = () => {
            dialogRef.current?.close();
        };

        const confirmButtonClass =
            variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

        return (
            <dialog
                ref={dialogRef}
                className="rounded-lg shadow-xl p-0 mt-[10vh] mx-auto backdrop:bg-gray-900/20"
                // @ts-expect-error closedby is not yet in React types but is standard HTML5
                closedby="any"
            >
                <div className="bg-white rounded-lg max-w-md w-full">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        <p className="text-sm text-gray-600">{message}</p>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {confirmText}
                                </span>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </dialog>
        );
    }
);

ConfirmDialog.displayName = 'ConfirmDialog';

export { ConfirmDialog };
