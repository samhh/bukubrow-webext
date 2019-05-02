import { compareAgainstMinimum } from 'Modules/semantic-versioning';

describe('compare against minimum semantic version', () => {
	test('correct format', () => {
		expect(compareAgainstMinimum('1.0.0', '1.0')).toBe(false);
		expect(compareAgainstMinimum('1.0', '1.0.0')).toBe(false);
		expect(compareAgainstMinimum('1.0.0', 'x.0.0')).toBe(false);
		expect(compareAgainstMinimum('42.51.60', '42.51.60')).toBe(true);
	});

	test('equal major version', () => {
		expect(compareAgainstMinimum('1.0.0', '2.0.0')).toBe(false);
		expect(compareAgainstMinimum('2.0.0', '1.0.0')).toBe(false);
		expect(compareAgainstMinimum('1.0.0', '1.0.0')).toBe(true);
	});

	test('equal or newer minor version', () => {
		expect(compareAgainstMinimum('1.1.0', '1.0.0')).toBe(false);
		expect(compareAgainstMinimum('1.0.0', '1.1.0')).toBe(true);
	});

	test('equal or newer patch version', () => {
		expect(compareAgainstMinimum('1.0.1', '1.0.0')).toBe(false);
		expect(compareAgainstMinimum('1.0.0', '1.0.1')).toBe(true);
	});
});
