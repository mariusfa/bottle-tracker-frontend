import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from '../components/header/Header';

const RootRoute: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
            <TanStackRouterDevtools />
        </>
    );
};

export const Route = createRootRoute({
    component: RootRoute,
});
