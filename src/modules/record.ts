import * as A from "fp-ts/lib/Array"
import * as R from "fp-ts/lib/Record"
import { getLastSemigroup } from "fp-ts/lib/Semigroup"

export const fromArray = <A, B extends string>(f: (a: A) => B) => (
  xs: Array<A>,
): Record<B, A> =>
  R.fromFoldableMap(getLastSemigroup<A>(), A.array)(xs, y => [f(y), y])
