import { describe, expect, test } from 'vitest';
import { screen, render } from '@testing-library/preact';
import { RegisterForm } from './RegisterForm';

describe('Register form', () => {

	test('should render the register form', () => {
		render(<RegisterForm handleSubmit={() => Promise.resolve({ error: false, conflict: false })} />);
		expect(screen.getByText('Name')).toBeDefined();
		expect(screen.getByText('Password')).toBeDefined();
		expect(screen.getByText('Submit')).toBeDefined();
	});
});
