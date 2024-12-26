import { describe, expect, test } from 'vitest';
import { screen, render } from '@testing-library/preact';
import { WinesView } from './WinesView';

describe('WinesView', () => {

	test('should render the wines view', () => {
		const fakeWines = [
			{ name: 'Wine 1' },
			{ name: 'Wine 2' },
		];
		render(<WinesView wines={fakeWines} addWine={() => {}} />);
		expect(screen.getByText('Wine 1')).toBeDefined();
	});

});
