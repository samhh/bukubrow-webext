const createUuidWithMaximum = (max: number) => (taken: number[] = []): number => {
	const id = Math.floor(Math.random() * max);

	return taken.includes(id) ? createUuidWithMaximum(max)(taken) : id;
};

export const createUuid = createUuidWithMaximum(Number.MAX_SAFE_INTEGER);

export const testables = {
	createUuidWithMaximum,
};

