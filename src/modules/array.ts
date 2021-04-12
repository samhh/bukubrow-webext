import { Predicate, flow } from "fp-ts/lib/function"
import { Eq } from "fp-ts/lib/Eq"
import * as A from "fp-ts/lib/Array"

export const lookupC = (i: number) => <T>(xs: Array<T>): Option<T> =>
  A.lookup(i, xs)

/**
 * `fp-ts/lib/Array::snoc` that doesn't resolve as a `NonEmptyArray`.
 */
export const snoc_ = <T>(xs: Array<T>) => (y: T): Array<T> => xs.concat(y)

export const asArray = <A>(xs: A | Array<A>): Array<A> =>
  Array.isArray(xs) ? xs : [xs]

export const elemC = <A>(eq: Eq<A>) => (x: A) => (ys: Array<A>): boolean =>
  A.elem(eq)(x, ys)

export const consC = <A>(xs: Array<A>) => (y: A): NonEmptyArray<A> =>
  A.cons(y, xs)

export const snocC = <A>(xs: Array<A>) => (y: A): NonEmptyArray<A> =>
  A.snoc(xs, y)

export const mapByPredicate = <A>(g: Endomorphism<A>) => (
  f: Predicate<A>,
): Endomorphism<Array<A>> => flow(A.map(x => (f(x) ? g(x) : x)))
