import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"

export const getOrElse = <A>(onElse: Lazy<A>) => <E>(
  x: EitherOption<E, A>,
): A => E.fold(onElse, O.getOrElse(onElse))(x)

export const isRightSome = <E, A>(
  x: EitherOption<E, A>,
): x is E.Right<O.Some<A>> => E.isRight(x) && O.isSome(x.right)
