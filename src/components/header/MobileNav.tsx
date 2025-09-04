import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';

interface MobileNavProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAuthenticated, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

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

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="md:hidden flex items-center" ref={mobileMenuRef}>
            <button
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Menu"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md transition-colors duration-200"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

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
                                    onClick={handleLinkClick}
                                >
                                    Search Wine
                                </Link>
                                <button
                                    onClick={handleLogout}
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
                                    onClick={handleLinkClick}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={handleLinkClick}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export { MobileNav };
