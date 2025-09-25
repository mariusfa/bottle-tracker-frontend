import { buildApiUrl } from '../config/api';
import { authService } from './authService';
import type { GetWineDTO, CreateWineDTO, UpdateWineDTO, ExternalWine } from '../types/wine';

// Wine collection API calls (require authentication)
export const searchWineByBarcode = async (barcode: string): Promise<GetWineDTO[]> => {
    const response = await fetch(buildApiUrl(`/wines/barcode/${encodeURIComponent(barcode)}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Wine search failed: ${response.statusText}`);
    }

    return response.json();
};

export const getAllUserWines = async (): Promise<GetWineDTO[]> => {
    const response = await fetch(buildApiUrl('/wines'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch wines: ${response.statusText}`);
    }

    return response.json();
};

export const getWineById = async (id: string): Promise<GetWineDTO> => {
    const response = await fetch(buildApiUrl(`/wines/${encodeURIComponent(id)}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
        },
    });

    if (response.status === 404) {
        throw new Error('Wine not found');
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch wine: ${response.statusText}`);
    }

    return response.json();
};

export const createWine = async (wine: CreateWineDTO): Promise<void> => {
    const response = await fetch(buildApiUrl('/wines'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(wine),
    });

    if (!response.ok) {
        throw new Error(`Failed to create wine: ${response.statusText}`);
    }

    // API returns 201 Created with no body
};

export const updateWine = async (id: string, wine: UpdateWineDTO): Promise<void> => {
    const response = await fetch(buildApiUrl(`/wines/${encodeURIComponent(id)}`), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(wine),
    });

    if (!response.ok) {
        throw new Error(`Failed to update wine: ${response.statusText}`);
    }

    // API returns success with no body
};

export const deleteWine = async (id: string): Promise<void> => {
    const response = await fetch(buildApiUrl(`/wines/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authService.getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete wine: ${response.statusText}`);
    }

    // API returns success with no body
};

// External wine API calls (no authentication required)
export const getExternalWineByBarcode = async (barcode: string): Promise<ExternalWine> => {
    const response = await fetch(
        buildApiUrl(`/wines/external/barcode/${encodeURIComponent(barcode)}`),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.status === 404) {
        throw new Error('Wine not found in external database');
    }

    if (!response.ok) {
        throw new Error(`External wine search failed: ${response.statusText}`);
    }

    return response.json();
};
