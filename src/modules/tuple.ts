import { Eq } from "fp-ts/lib/Eq"

export const equal = <A>(f: Eq<A>): Predicate<[A, A]> => ([xa, xb]): boolean =>
  f.equals(xa, xb)

export const mapBoth = <A, B>(f: (a: A) => B) => ([xa, xb]: [A, A]): [B, B] => [
  f(xa),
  f(xb),
]
