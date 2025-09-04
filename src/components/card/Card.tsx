import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    padding?: 'none' | 'small' | 'medium' | 'large';
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, padding = 'medium', className = '' }) => {
    const paddingClasses = {
        none: '',
        small: 'p-3',
        medium: 'p-6',
        large: 'p-8',
    };

    return (
        <div className={`bg-white shadow rounded-lg ${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    );
};

export { Card };
