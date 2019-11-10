import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';

export const lookupC = (i: number) => <T>(xs: T[]): O.Option<T> => A.lookup(i, xs);

/**
 * `fp-ts/lib/Array::snoc` that doesn't resolve as a `NonEmptyArray`.
 */
export const snoc_ = <T>(xs: T[]) => (y: T): T[] => xs.concat(y);

