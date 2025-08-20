import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App', () => {
    it('renders the main heading', () => {
        render(<App />);
        expect(screen.getByText('Vite + React + Tailwind CSS v4')).toBeInTheDocument();
    });

    it('renders initial count of 0', () => {
        render(<App />);
        expect(screen.getByText('count is 0')).toBeInTheDocument();
    });

    it('increments count when button is clicked', async () => {
        const user = userEvent.setup();
        render(<App />);
        
        const button = screen.getByRole('button', { name: /count is 0/i });
        await user.click(button);
        
        expect(screen.getByText('count is 1')).toBeInTheDocument();
    });

    it('renders Vite and React logos', () => {
        render(<App />);
        expect(screen.getByAltText('Vite logo')).toBeInTheDocument();
        expect(screen.getByAltText('React logo')).toBeInTheDocument();
    });
});