import { sortByObjectStringValue } from 'Modules/array';

describe('array methods', () => {
	test('sort array of objects alphabetically by string value', () => {
		const arrOfObj = [{ a: 'c' }, { a: 'd' }, { a: 'b' }];
		const expected = [arrOfObj[2], arrOfObj[0], arrOfObj[1]];
		const result = sortByObjectStringValue(arrOfObj, 'a');

		expect(result).not.toBe(arrOfObj);
		expect(result).toStrictEqual(expected);
	});
});
