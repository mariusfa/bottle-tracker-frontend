import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom';

// Cleanup rendered components after each test
afterEach(() => {
    cleanup();
});