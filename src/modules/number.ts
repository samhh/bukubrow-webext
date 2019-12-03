import { pipe } from 'fp-ts/lib/pipeable';
import { not, Predicate } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

export const isValidNumber: Predicate<number> = not(Number.isNaN);

export const toNumber = (x: unknown): Option<number> => pipe(
	Number(x),
	O.fromPredicate(isValidNumber),
);

