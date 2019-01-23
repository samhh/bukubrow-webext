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
		const input1 = ' :url :';
		const result1 = parseSearchInput(input1);
		const expected1: ParsedInputResult = {
			name: '',
			desc: [],
			url: ['url'],
			tags: [],
		};
		expect(result1).toMatchObject(expected1);
	});
});
