import { describe, expect, test } from 'vitest';
import { screen, render } from '@testing-library/preact';
import { WineByIdView } from './WineByIdView';

describe('WineByIdView', () => {

	test('should render the wine by id view', () => {
		const fakeWine = { id: '1', name: 'Wine 1' };
		render(<WineByIdView wine={fakeWine} isLoading={false} isError={false} />);
		expect(screen.getByText('Wine 1')).toBeDefined();
	});

});
