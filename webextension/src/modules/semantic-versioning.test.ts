import { compareAgainstMinimum } from './semantic-versioning';

describe('compare against minimum semantic version', () => {
	test('correct format', () => {
		expect(compareAgainstMinimum('1.0.0', '1.0')).toBeFalsy();
		expect(compareAgainstMinimum('1.0', '1.0.0')).toBeFalsy();
		expect(compareAgainstMinimum('1.0.0', 'x.0.0')).toBeFalsy();
		expect(compareAgainstMinimum('42.51.60', '42.51.60')).toBeTruthy();
	});

	test('equal major version', () => {
		expect(compareAgainstMinimum('1.0.0', '2.0.0')).toBeFalsy();
		expect(compareAgainstMinimum('2.0.0', '1.0.0')).toBeFalsy();
		expect(compareAgainstMinimum('1.0.0', '1.0.0')).toBeTruthy();
	});

	test('equal or newer minor version', () => {
		expect(compareAgainstMinimum('1.1.0', '1.0.0')).toBeFalsy();
		expect(compareAgainstMinimum('1.0.0', '1.1.0')).toBeTruthy();
	});

	test('equal or newer patch version', () => {
		expect(compareAgainstMinimum('1.0.1', '1.0.0')).toBeFalsy();
		expect(compareAgainstMinimum('1.0.0', '1.0.1')).toBeTruthy();
	});
});
