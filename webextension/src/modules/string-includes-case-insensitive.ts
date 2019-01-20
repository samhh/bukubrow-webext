const stringIncludesCaseInsensitive = (test: string, searchString: string) =>
	test.toLowerCase().includes(searchString.toLowerCase());

export default stringIncludesCaseInsensitive;
