import { pipe } from "fp-ts/lib/pipeable"
import * as O from "fp-ts/lib/Option"
import * as A from "fp-ts/lib/Array"
import {
  prismNonNegativeInteger,
  NonNegativeInteger,
} from "newtype-ts/lib/NonNegativeInteger"
import { prismModifyOption } from "~/modules/prism"
import { add } from "fp-ts-std/Number"

/**
 * Includes, but case-insensitive.
 */
export const includesCI = (x: string): Predicate<string> => (y): boolean =>
  y.toLowerCase().includes(x.toLowerCase())

/**
 * Return ending index (index plus one) of the first match from a series of
 * tests.
 */
export const endIndexOfAnyOf = (x: string) => (
  ys: Array<string>,
): Option<NonNegativeInteger> =>
  pipe(
    ys,
    A.findFirstMap(y =>
      pipe(
        indexOf(y)(x),
        O.chain(prismModifyOption(prismNonNegativeInteger)(add(y.length))),
      ),
    ),
  )

export const indexOf = (x: string) => (y: string): Option<NonNegativeInteger> =>
  pipe(y.indexOf(x), prismNonNegativeInteger.getOption)
