import { flow, constVoid } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as IO from 'fp-ts/lib/IO';
import * as A from 'fp-ts/lib/Array';

/*
 * Drop the return value of the provided function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _ = <A extends Array<any>>(f: (...args: A) => any) => (...args: A): void => void f(...args);

export const runIO = <A>(x: IO<A>): A => x();

export const runIO_ = _(runIO);

export const runIOs = <A>(...xs: Array<IO<A>>): Array<A> => A.map(runIO)(xs);

export const runIOs_ = _(runIOs);

export const seqIO = A.array.sequence(IO.io);

export const seqIO_ = flow(seqIO, IO.map(constVoid));

export const seqT = A.array.sequence(T.task);

export const seqT_ = flow(seqT, T.map(constVoid));

export const runTask = <A>(x: Task<A>): Promise<A> => x();

export const flip = <
	A extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
	B extends Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
	C,
>(f: (...a: A) => (...b: B) => C) => (...b: B) => (...a: A): C => f(...a)(...b);

export const tap = (m = '') => <A>(x: A): A => {
	// eslint-disable-next-line no-console
	console.log(m, x);
	return x;
};

