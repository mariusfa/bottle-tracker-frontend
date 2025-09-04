import React from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                to="/"
                                className="text-2xl font-bold text-blue-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                🍷 Bottle Tracker
                            </Link>
                        </div>
                    </div>

                    <DesktopNav isAuthenticated={isAuthenticated} onLogout={logout} />
                    <MobileNav isAuthenticated={isAuthenticated} onLogout={logout} />
                </div>
            </div>
        </nav>
    );
};

export { Header };
