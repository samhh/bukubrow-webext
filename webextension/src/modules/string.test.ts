import { includesCaseInsensitive } from 'Modules/string';

describe('string methods', () => {
	test('string contains string case insensitively', () => {
		expect(includesCaseInsensitive('abc', 'ab')).toBe(true);
		expect(includesCaseInsensitive('abc', 'bC')).toBe(true);
		expect(includesCaseInsensitive('abc', 'd')).toBe(false);
		expect(includesCaseInsensitive('abc', 'EF')).toBe(false);
	});
});
