import * as O from 'fp-ts/lib/Option';
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
		expect(endIndexOfAnyOf('abca')(['a'])).toEqual(O.some(1));
		expect(endIndexOfAnyOf('abca')(['c'])).toEqual(O.some(3));
		expect(endIndexOfAnyOf('abcaA')(['A'])).toEqual(O.some(5));
		expect(endIndexOfAnyOf('oh, hello there')(['hello', 'oh'])).toEqual(O.some(9));
	});

	test('returns -1 when no matches', () => {
		expect(endIndexOfAnyOf('abc')(['d', 'e', 'f'])).toEqual(O.none);
	});
});
