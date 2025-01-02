import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { AddWineForm } from './AddWineForm';
import { Values } from './types';

describe('AddWineForm', () => {
	test('should render the add wine form', () => {
		render(<AddWineForm handleSubmit={(_: Values) => { }} />);
		expect(screen.getByText('Name')).toBeDefined();
		expect(screen.getByRole('button', { name: 'Add wine' })).toBeDefined();
	});

	test('should submit add wine', async () => {
		let isSubmitted = false;
		const handleSubmit = (_: Values) => {
			isSubmitted = true;
		}

		render(<AddWineForm handleSubmit={handleSubmit} />);
		await userEvent.type(screen.getByLabelText('Name'), 'Wine 1');
		await userEvent.click(screen.getByRole('button', { name: 'Add wine' }));
		expect(isSubmitted).toBe(true);
	});
});
