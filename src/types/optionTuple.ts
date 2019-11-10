import * as O from 'fp-ts/lib/Option';
import { sequenceT } from 'fp-ts/lib/Apply';

export type OptionTuple<A, B> = O.Option<[A, B]>;

export const optionTuple = sequenceT(O.option);

export const fromNullable = <A, B>(a: A | null | undefined, b: B | null | undefined): OptionTuple<A, B> =>
	a === null || a === undefined || b === null || b === undefined
		? O.none
		: O.some([a, b]);

