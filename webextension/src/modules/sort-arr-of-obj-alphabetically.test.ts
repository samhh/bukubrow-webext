import sort from 'Modules/sort-arr-of-obj-alphabetically';

describe('sort array of objects alphabetically', () => {
	test('sort as expected', () => {
		const arrOfObj = [{ a: 'c' }, { a: 'd' }, { a: 'b' }];
		const expected = [arrOfObj[2], arrOfObj[0], arrOfObj[1]];
		const result = sort(arrOfObj, 'a');

		expect(result).not.toBe(arrOfObj);
		expect(result).toMatchObject(expected);
	});
});
