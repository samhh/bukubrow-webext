import { pipe } from 'fp-ts/lib/pipeable';
import { randomInt } from 'fp-ts/lib/Random';
import { eqNumber } from 'fp-ts/lib/Eq';
import * as IO from 'fp-ts/lib/IO';
import * as A from 'fp-ts/lib/Array';
import * as B from 'fp-ts/lib/boolean';

const createUuidWithMaximum = (max: number) => (taken: Array<number> = []): IO<number> => pipe(
	randomInt(1, max),
	IO.chain((id) => pipe(
		A.elem(eqNumber)(id, taken),
		B.fold(
			() => IO.of(id),
			() => createUuidWithMaximum(max)(taken),
		),
	)),
);

export const createUuid = createUuidWithMaximum(Number.MAX_SAFE_INTEGER);

export const testables = {
	createUuidWithMaximum,
};

