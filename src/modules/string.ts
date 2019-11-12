export const includesCaseInsensitive = (test: string, searchString: string) =>
	test.toLowerCase().includes(searchString.toLowerCase());

/**
 * Return ending index (index plus one) of the first match from a series of
 * tests.
 */
export const endIndexOfAnyOf = (test: string, searchStrings: string[]) => {
	for (const searchString of searchStrings) {
		const index = test.indexOf(searchString);

		if (index !== -1) return index + searchString.length;
	}

	return -1;
};

export const toString = (x: number): string => String(x);

