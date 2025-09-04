import React from 'react';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center';
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    align = 'center',
    className = '',
}) => {
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
    };

    return (
        <div className={`mb-8 ${alignmentClasses[align]} ${className}`}>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    );
};

export { PageHeader };
