import * as O from 'fp-ts/lib/Option';
import { prismNonNegativeInteger, NonNegativeInteger } from 'newtype-ts/lib/NonNegativeInteger';

export const includes = (x: string) => (y: string): boolean => y.includes(x);

// TODO curry and shorten name?
export const includesCaseInsensitive = (test: string, searchString: string): boolean =>
	test.toLowerCase().includes(searchString.toLowerCase());

/**
 * Return ending index (index plus one) of the first match from a series of
 * tests.
 */
export const endIndexOfAnyOf = (test: string) => (searchStrings: Array<string>): Option<NonNegativeInteger> => {
	for (const searchString of searchStrings) {
		const index = test.indexOf(searchString);

		if (index !== -1) return prismNonNegativeInteger.getOption(index + searchString.length);
	}

	return O.none;
};

export const fromNumber = (x: number): string => String(x);

export const take = (start: number) => (x: string): string => x.substring(start);

export const split = (x: string | RegExp) => (y: string): Array<string> => y.split(x);

