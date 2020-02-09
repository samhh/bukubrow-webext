import { pipe } from 'fp-ts/lib/pipeable';
import { constant, flow } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { lookupC, snocC } from '~~/modules/array';

export const exec = (x: RegExp) => (y: string): Option<RegExpExecArray> =>
	pipe(x.exec(y), O.fromNullable);

// This works as it does without mutating `x` because `RegExp.prototype.exec`
// is stateful under the hood for global and sticky `RegExp` objects
export const execMulti = (x: string) => (r: RegExp): Array<string> => {
	const f = exec(r);

	const g = (ys: Array<string> = []): Array<string> => pipe(
		f(x),
		O.chain(lookupC(1)),
		O.fold(
			constant(ys),
			flow(snocC(ys), g)
		));

	return g();
};

