import { eqString as eqStringB, eqNumber as eqNumberB } from 'fp-ts/lib/Eq';

export const eqString = (x: string): Predicate<string> => (y): boolean => eqStringB.equals(x, y);

export const eqNumber = (x: number): Predicate<number> => (y): boolean => eqNumberB.equals(x, y);

