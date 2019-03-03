import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Tuple } from 'purify-ts/Tuple';

type ADTNullable<T> = T | null | undefined;

export class MaybeTuple {
	public static fromNullable<F, S>(fst: ADTNullable<F>, snd: ADTNullable<S>): Maybe<Tuple<F, S>> {
		return fst !== null && fst !== undefined && snd !== null && snd !== undefined
			? Just(Tuple(fst, snd))
			: Nothing;
	}

	public static fromMaybe<F, S>(fst: Maybe<F>, snd: Maybe<S>): Maybe<Tuple<F, S>> {
		return fst.caseOf({
			Just: f => snd.caseOf({
				Just: s => Just(Tuple(f, s)),
				Nothing: () => Nothing,
			}),
			Nothing: () => Nothing,
		});
	}
}
