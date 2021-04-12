import { Reducer, Action } from "redux"

export const curryReducer = <A extends Action, S>(
  f: (a: A) => (s: S) => (s: S) => S,
) => (x: S): Reducer<S, A> => (s: S = x, a: A): S => f(a)(s)(s)
