import { includesCaseInsensitive, endIndexOfAnyOf } from 'Modules/string';

describe('includesCaseInsensitive', () => {
	test('string contains string case insensitively', () => {
		expect(includesCaseInsensitive('abc', 'ab')).toBe(true);
		expect(includesCaseInsensitive('abc', 'bC')).toBe(true);
		expect(includesCaseInsensitive('abc', 'd')).toBe(false);
		expect(includesCaseInsensitive('abc', 'EF')).toBe(false);
	});
});

describe('endIndexOfAnyOf', () => {
	test('returns first matching index', () => {
		expect(endIndexOfAnyOf('abca', ['a'])).toBe(1);
		expect(endIndexOfAnyOf('abca', ['c'])).toBe(3);
		expect(endIndexOfAnyOf('abcaA', ['A'])).toBe(5);
		expect(endIndexOfAnyOf('oh, hello there', ['hello', 'oh'])).toBe(9);
	});

	test('returns -1 when no matches', () => {
		expect(endIndexOfAnyOf('abc', ['d', 'e', 'f'])).toBe(-1);
	});
});
