import * as O from 'fp-ts/lib/Option';
import { includesCI, endIndexOfAnyOf } from 'Modules/string';

describe('includesCI', () => {
	test('string contains string case insensitively', () => {
		expect(includesCI('ab')('abc')).toBe(true);
		expect(includesCI('bC')('abc')).toBe(true);
		expect(includesCI('d')('abc')).toBe(false);
		expect(includesCI('EF')('abc')).toBe(false);
	});
});

describe('endIndexOfAnyOf', () => {
	test('returns first matching index', () => {
		expect(endIndexOfAnyOf('abca')(['a'])).toEqual(O.some(1));
		expect(endIndexOfAnyOf('abca')(['c'])).toEqual(O.some(3));
		expect(endIndexOfAnyOf('abcaA')(['A'])).toEqual(O.some(5));
		expect(endIndexOfAnyOf('oh, hello there')(['hello', 'oh'])).toEqual(O.some(9));
	});

	test('returns None when no matches', () => {
		expect(endIndexOfAnyOf('abc')(['d', 'e', 'f'])).toEqual(O.none);
	});
});
