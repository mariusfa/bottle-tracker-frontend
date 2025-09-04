import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Close mobile menu when clicking outside or pressing escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

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
                    
                    {/* Desktop Navigation */}
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
                                    onClick={logout}
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

                    {/* Mobile hamburger button */}
                    <div className="md:hidden flex items-center" ref={mobileMenuRef}>
                        <button
                            onClick={toggleMobileMenu}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Menu"
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-md transition-colors duration-200"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Mobile dropdown menu */}
                        {isMobileMenuOpen && (
                            <div
                                data-testid="mobile-dropdown"
                                className="absolute right-0 top-16 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                            >
                                <div className="py-1">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/wines/search"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Search Wine
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export { Header };