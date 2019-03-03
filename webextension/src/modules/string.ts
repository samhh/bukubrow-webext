export const includesCaseInsensitive = (test: string, searchString: string) =>
	test.toLowerCase().includes(searchString.toLowerCase());

export const endIndexOfAnyOf = (test: string, searchStrings: string[]) => {
	for (const searchString of searchStrings) {
		const index = test.indexOf(searchString);

		if (index !== -1) return index + searchString.length;
	}

	return -1;
};
