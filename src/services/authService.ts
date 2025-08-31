const TOKEN_KEY = 'bottle_tracker_token';

export const authService = {
    setToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isAuthenticated: (): boolean => {
        const token = authService.getToken();
        if (!token) return false;

        try {
            // Check if token is expired (basic JWT check)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            // If token is malformed, consider it invalid
            return false;
        }
    },

    logout: (): void => {
        authService.removeToken();
        // Could also clear other user-related data here
    }
};