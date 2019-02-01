import parseSearchInput, { ParsedInputResult } from 'Modules/parse-search-input';

describe('parse search input', () => {
	test('correctly parse ideal input', () => {
		const input1 = 'thing >desc #tag1 #tag2 *all :url';
		const result1 = parseSearchInput(input1);
		const expected1: ParsedInputResult = {
			name: 'thing',
			desc: ['desc'],
			url: ['url'],
			tags: ['tag1', 'tag2'],
			wildcard: ['all'],
		};
		expect(result1).toStrictEqual(expected1);

		const input2 = '>a b c';
		const result2 = parseSearchInput(input2);
		const expected2: ParsedInputResult = {
			name: '',
			desc: ['a b c'],
			url: [],
			tags: [],
			wildcard: [],
		};
		expect(result2).toStrictEqual(expected2);

		const input3 = '*search all';
		const result3 = parseSearchInput(input3);
		const expected3: ParsedInputResult = {
			name: '',
			desc: [],
			url: [],
			tags: [],
			wildcard: ['search all'],
		};
		expect(result3).toStrictEqual(expected3);
	});

	test('correctly parse peculiar input', () => {
		const emptyResult: ParsedInputResult = {
			name: '',
			desc: [],
			url: [],
			tags: [],
			wildcard: [],
		};

		const testCases: [string, Partial<ParsedInputResult>][] = [
			['a', { name: 'a' }],
			['a :', { name: 'a :' }],
			['a :u', { name: 'a', url: ['u'] }],
			['a:a', { name: 'a:a' }],
			['a:a :', { name: 'a:a :' }],
			['a:a :u', { name: 'a:a', url: ['u'] }],
			['aa', { name: 'aa' }],
			[' a :', { name: ' a :' }],
			[' a :u', { name: ' a', url: ['u'] }],
			[' :', { name: ' :' }],
			[' :u', { url: ['u'] }],
			[' :u :', { url: ['u'] }],
			[' :u :u', { url: ['u', 'u'] }],
		];

		for (const testCase of testCases) {
			expect(parseSearchInput(testCase[0])).toStrictEqual({ ...emptyResult, ...testCase[1] });
		}
	});
});
