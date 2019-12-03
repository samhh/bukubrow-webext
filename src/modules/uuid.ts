import * as IO from 'fp-ts/lib/IO';

const createUuidWithMaximum = (max: number) => (taken: number[] = []): IO<number> => {
	const id = Math.floor(Math.random() * max);

	return taken.includes(id)
		? createUuidWithMaximum(max)(taken)
		: IO.of(id);
};

export const createUuid = createUuidWithMaximum(Number.MAX_SAFE_INTEGER);

export const testables = {
	createUuidWithMaximum,
};

