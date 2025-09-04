import React from 'react';

export interface PageLayoutProps {
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, maxWidth = 'md', className = '' }) => {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full',
    };

    return (
        <div className={`${maxWidthClasses[maxWidth]} mx-auto py-6 sm:px-6 lg:px-8 ${className}`}>
            <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
    );
};

export { PageLayout };
