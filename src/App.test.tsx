import { describe, test, expect } from 'vitest';

// Simple smoke test to verify the route tree is generated
describe('Router Setup', () => {
    test('route tree is generated and importable', async () => {
        const { routeTree } = await import('./routeTree.gen');
        expect(routeTree).toBeDefined();
    });
});
