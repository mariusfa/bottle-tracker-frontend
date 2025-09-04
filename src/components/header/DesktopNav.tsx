import React from 'react';
import { Link } from '@tanstack/react-router';

type Props = {
    isAuthenticated: boolean;
    onLogout: () => void;
};

const DesktopNav: React.FC<Props> = ({ isAuthenticated, onLogout }) => {
    return (
        <div className="hidden md:flex items-center space-x-3" data-testid="desktop-nav">
            {isAuthenticated ? (
                <>
                    <Link
                        to="/wines/search"
                        className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
                    >
                        Search Wine
                    </Link>
                    <button
                        onClick={onLogout}
                        className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <>
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </>
            )}
        </div>
    );
};

export { DesktopNav };
