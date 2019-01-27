import parseSearchInput, { ParsedInputResult } from 'Modules/parse-search-input';

describe('parse search input', () => {
	test('correctly parse ideal input', () => {
		const input1 = 'thing >desc #tag1 #tag2 :url';
		const result1 = parseSearchInput(input1);
		const expected1: ParsedInputResult = {
			name: 'thing',
			desc: ['desc'],
			url: ['url'],
			tags: ['tag1', 'tag2'],
		};
		expect(result1).toMatchObject(expected1);

		const input2 = '>a b c';
		const result2 = parseSearchInput(input2);
		const expected2: ParsedInputResult = {
			name: '',
			desc: ['a b c'],
			url: [],
			tags: [],
		};
		expect(result2).toMatchObject(expected2);
	});

	test('correctly parse peculiar input', () => {
		const emptyResult: ParsedInputResult = {
			name: '',
			desc: [],
			url: [],
			tags: [],
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
			expect(parseSearchInput(testCase[0])).toMatchObject({ ...emptyResult, ...testCase[1] });
		}
	});
});
