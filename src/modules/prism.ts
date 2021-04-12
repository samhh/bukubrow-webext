import { pipe } from "fp-ts/lib/pipeable"
import { Endomorphism } from "fp-ts/lib/function"
import { Prism } from "monocle-ts"

export const prismModifyOption = <A, B>(p: Prism<A, B>) => (
  f: Endomorphism<A>,
) => (x: B): Option<B> => pipe(x, p.reverseGet, f, p.getOption)
