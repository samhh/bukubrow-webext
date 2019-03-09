const uuid = (taken: number[] = [], max = Number.MAX_SAFE_INTEGER) => {
	let id;

	do {
		// Minimum is 0, maximum is value of max
		id = Math.floor(Math.random() * (max + 1));
	} while (taken.includes(id));

	return id;
};

export default uuid;
