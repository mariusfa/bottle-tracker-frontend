import { buildApiUrl } from '../config/api';

interface RegisterUserRequest {
    name: string;
    password: string;
}

export interface LoginUserRequest {
    name: string;
    password: string;
}

export interface LoginUserResponse {
    token: string;
}

export const registerUser = async (userData: RegisterUserRequest): Promise<void> => {
    const response = await fetch(buildApiUrl('/users/register'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (response.status === 409) {
        throw new Error('User already exists');
    }

    if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
    }
};

export const loginUser = async (userData: LoginUserRequest): Promise<LoginUserResponse> => {
    const response = await fetch(buildApiUrl('/users/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    return response.json();
};

export const validateUser = async (token: string): Promise<void> => {
    const response = await fetch(buildApiUrl('/users/validate'), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Token validation failed: ${response.statusText}`);
    }
};
