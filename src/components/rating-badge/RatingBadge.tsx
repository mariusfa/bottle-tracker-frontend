import React from 'react';
import type { WineRating } from '../../types/wine';

type Props = {
    rating: WineRating;
};

const getRatingStyles = (rating: WineRating): string => {
    switch (rating) {
        case 'GOOD':
            return 'bg-green-100 text-green-800';
        case 'OK':
            return 'bg-yellow-100 text-yellow-800';
        case 'BAD':
            return 'bg-red-100 text-red-800';
        case 'NONE':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const RatingBadge: React.FC<Props> = ({ rating }) => {
    if (rating === 'NONE') {
        return null;
    }

    const baseClasses = 'inline-flex px-2 py-1 text-xs font-medium rounded';
    const colorClasses = getRatingStyles(rating);

    return (
        <span className={`${baseClasses} ${colorClasses}`}>
            {rating}
        </span>
    );
};

export { RatingBadge };