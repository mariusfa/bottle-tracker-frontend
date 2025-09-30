import React from 'react';

const GeneralError: React.FC = () => {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            A technical error occurred. Please try again.
        </div>
    );
};

export { GeneralError };
