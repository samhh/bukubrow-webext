export const includesCaseInsensitive = (test: string, searchString: string): boolean =>
	test.toLowerCase().includes(searchString.toLowerCase());

/**
 * Return ending index (index plus one) of the first match from a series of
 * tests.
 */
// TODO use Option
export const endIndexOfAnyOf = (test: string, searchStrings: Array<string>): number => {
	for (const searchString of searchStrings) {
		const index = test.indexOf(searchString);

		if (index !== -1) return index + searchString.length;
	}

	return -1;
};

export const toString = (x: number): string => String(x);

