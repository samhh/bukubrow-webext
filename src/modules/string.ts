import { pipe } from 'fp-ts/lib/pipeable';
import { Predicate } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import { prismNonNegativeInteger, NonNegativeInteger } from 'newtype-ts/lib/NonNegativeInteger';
import { prismModifyOption } from 'Modules/prism';
import { add } from 'Modules/math';

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
export const endIndexOfAnyOf = (x: string) => (ys: Array<string>): Option<NonNegativeInteger> => pipe(
	ys,
	A.findFirstMap((y) => pipe(
		indexOf(y)(x),
		O.chain(prismModifyOption(prismNonNegativeInteger)(add(y.length))),
	)),
);

export const fromNumber = (x: number): string => String(x);

export const take = (i: number) => (x: string): string => x.substring(i);

export const split = (x: string | RegExp) => (y: string): Array<string> => y.split(x);

export const indexOf = (x: string) => (y: string): Option<NonNegativeInteger> =>
	pipe(y.indexOf(x), prismNonNegativeInteger.getOption);

