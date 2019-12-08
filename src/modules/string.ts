import { Predicate } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { prismNonNegativeInteger, NonNegativeInteger } from 'newtype-ts/lib/NonNegativeInteger';

export const includes = (x: string): Predicate<string> => (y): boolean => y.includes(x);

/**
 * Includes, but case-insensitive.
 */
export const includesCI = (x: string): Predicate<string> => (y): boolean =>
	y.toLowerCase().includes(x.toLowerCase());

/**
 * Return ending index (index plus one) of the first match from a series of
 * tests.
 */
// TODO
export const endIndexOfAnyOf = (x: string) => (ys: Array<string>): Option<NonNegativeInteger> => {
	for (const searchString of ys) {
		const index = x.indexOf(searchString);

		if (index !== -1) return prismNonNegativeInteger.getOption(index + searchString.length);
	}

	return O.none;
};

export const fromNumber = (x: number): string => String(x);

export const take = (i: number) => (x: string): string => x.substring(i);

export const split = (x: string | RegExp) => (y: string): Array<string> => y.split(x);

