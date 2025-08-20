import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const App: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="max-w-5xl mx-auto p-8 text-center">
            <div className="flex justify-center gap-8 mb-8">
                <a
                    href="https://vite.dev"
                    target="_blank"
                    className="transition-transform hover:scale-110"
                >
                    <img src={viteLogo} className="h-24 p-6" alt="Vite logo" />
                </a>
                <a
                    href="https://react.dev"
                    target="_blank"
                    className="transition-transform hover:scale-110"
                >
                    <img src={reactLogo} className="h-24 p-6 animate-spin-slow" alt="React logo" />
                </a>
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-8">
                Vite + React + Tailwind CSS v4
            </h1>
            <div className="p-8">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
                    onClick={() => setCount(count => count + 1)}
                >
                    count is {count}
                </button>
                <p className="text-gray-600">
                    Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/App.tsx</code>{' '}
                    and save to test HMR
                </p>
            </div>
            <p className="text-gray-500 text-sm">Click on the Vite and React logos to learn more</p>
        </div>
    );
};

export { App };
