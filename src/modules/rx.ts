import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { Observable, from, of } from 'rxjs';
import * as Rx from 'rxjs/operators';
import { Action } from 'redux';

/**
 * Like `ofType` from `redux-observable`, however this one narrows the type.
 * See: https://github.com/redux-observable/redux-observable/pull/459
 */
export const ofType = <T extends Action<string>, K extends string>(...ks: K[]) =>
	(source: Observable<T>) => source.pipe(
		Rx.filter((action): action is Extract<T, { type: K }> => (ks as string[]).includes(action.type))
	);

/**
 * A combination of `tap` and `ignoreElements`.
 */
export const tap_ = <T>(cb: (x: T) => void) => (x: Observable<T>): Observable<never> => x.pipe(
	Rx.tap(cb),
	Rx.ignoreElements(),
);

export const fromTask = <A>(x: T.Task<A>): Observable<A> => from(x());

export const filterSome = <A>(x: Observable<O.Option<A>>): Observable<A> => x.pipe(
	Rx.filter((y): y is O.Some<A> => O.isSome(y)),
	Rx.map(y => y.value),
);

export const filterRight = <A>(x: Observable<E.Either<unknown, A>>): Observable<A> => x.pipe(
	Rx.filter((y): y is E.Right<A> => E.isRight(y)),
	Rx.map(y => y.right),
);

