import { testables } from 'Modules/uuid';

describe('createUuidWithMaximum', () => {
	test('generates unique ids that are not already taken', () => {
		const create = testables.createUuidWithMaximum;

		for (let i = 0; i < 100; i++) {
			expect(create(2)([1])()).toEqual(2);
		}
	});
});

