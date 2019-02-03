export const includesCaseInsensitive = (test: string, searchString: string) =>
	test.toLowerCase().includes(searchString.toLowerCase());
