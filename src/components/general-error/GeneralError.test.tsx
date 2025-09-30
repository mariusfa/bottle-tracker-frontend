import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GeneralError } from './GeneralError';

describe('GeneralError', () => {
    it('renders standard error message', () => {
        render(<GeneralError />);

        expect(screen.getByText('A technical error occurred. Please try again.')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
        const { container } = render(<GeneralError />);

        const errorDiv = container.querySelector('.bg-red-50.border.border-red-200');
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv).toHaveClass('text-red-700', 'px-4', 'py-3', 'rounded');
    });

    it('renders consistently', () => {
        const { container: container1 } = render(<GeneralError />);
        const { container: container2 } = render(<GeneralError />);

        expect(container1.textContent).toBe(container2.textContent);
    });
});
