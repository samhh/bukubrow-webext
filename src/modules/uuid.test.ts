import { testables } from 'Modules/uuid';

describe('createUuidWithMaximum', () => {
	test('generates unique ids that are not already taken', () => {
		const create = testables.createUuidWithMaximum;

		const vals: number[] = [];

		for (let i = 0; i < 100; i++) {
			vals.push(create(2)([1]));
		}

		expect(vals).not.toContain(1);
	});
});
