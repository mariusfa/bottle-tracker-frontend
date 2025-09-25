// Wine types based on bottle-tracker-go-api

export const WineType = {
    RED: 'RED',
    WHITE: 'WHITE',
    SPARKLING: 'SPARKLING',
    ROSE: 'ROSE',
} as const;

export type WineType = (typeof WineType)[keyof typeof WineType];

export const WineRating = {
    GOOD: 'GOOD',
    OK: 'OK',
    BAD: 'BAD',
    NONE: 'NONE',
} as const;

export type WineRating = (typeof WineRating)[keyof typeof WineRating];

// API Response DTOs
export interface GetWineDTO {
    id: string;
    name: string;
    country: string;
    vintage_year?: number;
    type: WineType;
    rating: WineRating;
    barcode?: string;
}

export interface CreateWineDTO {
    name: string;
    country: string;
    vintage_year?: number;
    type: WineType;
    rating?: WineRating;
    barcode?: string;
}

export interface UpdateWineDTO {
    name?: string;
    country?: string;
    vintage_year?: number;
    type?: WineType;
    rating?: WineRating;
    barcode?: string;
}

export interface ExternalWine {
    name: string;
    type: string;
    price: number;
    volume: number;
    country: string;
}

// Form types for components
export interface WineFormData {
    name: string;
    country: string;
    vintageYear: string; // String for form input, converted to number for API
    type: WineType | '';
    rating: WineRating;
    barcode: string;
}

export interface WineFormErrors {
    name?: string;
    country?: string;
    vintageYear?: string;
    type?: string;
    rating?: string;
    barcode?: string;
}

// Search types
export interface WineSearchResult {
    wines: GetWineDTO[];
    found: boolean;
    error?: string;
}

export interface ExternalWineSearchResult {
    wine?: ExternalWine;
    found: boolean;
    error?: string;
}
